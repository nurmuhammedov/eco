import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { format } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker'
import { InputFile } from '@/shared/components/common/file-upload'
import { useAdd } from '@/shared/hooks'
import type { UserDelegationPayload } from '../model/types'
import { useQueryClient } from '@tanstack/react-query'
import { Combobox } from '@/shared/components/ui/combobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import useData from '@/shared/hooks/api/use-data'
import { useEffect } from 'react'
import { UserRoleLabels, UserRoles } from '@/shared/types/user'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

/** SelectUserDto: a staff member as the user selects list them */
interface SelectUser {
  id: string
  name: string | null
  role: UserRoles | null
  unitName: string | null
}

const USER_SELECT_ENDPOINTS: Partial<Record<string, string>> = {
  committee: '/users/committee-users/select',
  office: '/users/office-users/select',
  regulator: '/users/regulator-users/select',
}

export const DelegationReasonLabels: Record<string, string> = {
  ANNUAL_LEAVE: 'Mehnat ta’tili',
  SICK_LEAVE: 'Kasallik varaqasi',
  ACCIDENT: 'Baxtsiz hodisa',
  EMPLOYMENT_TERMINATION: 'Ishdan bo‘shash',
  BUSINESS_TRIP: 'Xizmat safari',
  MATERNITY_LEAVE: 'Dekret ta’tili',
  URGENT_ASSIGNMENT: 'Tezkor topshiriq',
  OTHER: 'Boshqa',
}

const schema = z.object({
  employeeType: z.enum(['committee', 'office', 'regulator']),
  delegatorId: z.string().min(1),
  delegateeId: z.string().min(1),
  startDate: z.date(),
  endDate: z.date(),
  reasonType: z.string().min(1),
  basisPath: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

interface AddDelegationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddDelegationModal = ({ isOpen, onClose }: AddDelegationModalProps) => {
  const queryClient = useQueryClient()
  const { mutate: createDelegation, isPending } = useAdd<UserDelegationPayload>('/user-delegation')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      employeeType: undefined,
      delegatorId: '',
      delegateeId: '',
      reasonType: '',
      basisPath: '',
    },
  })

  const employeeType = form.watch('employeeType')
  const delegatorId = form.watch('delegatorId')

  const usersEndpoint = USER_SELECT_ENDPOINTS[employeeType]
  const { data: users = [] } = useData<SelectUser[]>(usersEndpoint ?? '', !!usersEndpoint)

  const options = users.map((user) => {
    const roleTranslation = user.role ? (UserRoleLabels[user.role] ?? '') : ''
    const unitAndRole = [user.unitName, roleTranslation].filter(Boolean).join(' ')
    return { id: user.id, name: `${user.name || user.id}${unitAndRole ? ` (${unitAndRole})` : ''}` }
  })

  const getDelegatorOptions = () => {
    if (!employeeType) return []
    return options
  }

  const getDelegateeOptions = () => {
    if (!employeeType) return []
    return options.filter((option) => option.id !== delegatorId)
  }

  useEffect(() => {
    form.setValue('delegatorId', '')
    form.setValue('delegateeId', '')
  }, [employeeType, form])

  const onSubmit = ({ delegatorId, delegateeId, startDate, endDate, basisPath, reasonType }: FormValues) =>
    createDelegation(
      {
        delegatorId,
        delegateeId,
        basisPath,
        reasonType,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
      {
        onSuccess: () => {
          form.reset()
          onClose()
          return invalidateEndpoint(queryClient, '/user-delegation')
        },
      }
    )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Vazifa yuklash qo‘shish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="add-delegation-form" onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="employeeType"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel required>Xodim turi</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="committee">Qo‘mita xodimlari</SelectItem>
                          <SelectItem value="office">Hududiy bo‘lim xodimlari</SelectItem>
                          <SelectItem value="regulator">Inspeksiya xodimlari</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="delegatorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Kim tomonidan</FormLabel>
                    <FormControl>
                      <Combobox
                        options={getDelegatorOptions()}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!employeeType}
                        placeholder="Tanlang"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="delegateeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Kimga</FormLabel>
                    <FormControl>
                      <Combobox
                        options={getDelegateeOptions()}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!employeeType}
                        placeholder="Tanlang"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel required>Boshlanish sanasi</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!employeeType}
                      disableStrategy="before"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel required>Tugash sanasi</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!employeeType}
                      disableStrategy="before"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reasonType"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel required>Sabab turi</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ''} disabled={!employeeType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DelegationReasonLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basisPath"
                render={({ field }) => (
                  <FormItem className="col-span-1 flex flex-col justify-end">
                    <FormLabel required>Asos fayli</FormLabel>
                    <FormControl>
                      <InputFile
                        name={field.name as 'basisPath'}
                        form={form}
                        uploadEndpoint="/attachments/user-delegation"
                        disabled={!employeeType}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
