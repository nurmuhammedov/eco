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
import { useQueryClient } from '@tanstack/react-query'
import { Combobox } from '@/shared/components/ui/combobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import useData from '@/shared/hooks/api/useData'
import { useEffect } from 'react'
import { UserRoleLabels, UserRoles } from '@/entities/user'

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
  employeeType: z.enum(['committee', 'office', 'regulator'], { required_error: 'Majburiy maydon' }),
  delegatorId: z.string().min(1, 'Majburiy maydon'),
  delegateeId: z.string().min(1, 'Majburiy maydon'),
  startDate: z.date({ required_error: 'Majburiy maydon' }),
  endDate: z.date({ required_error: 'Majburiy maydon' }),
  reasonType: z.string().min(1, 'Majburiy maydon'),
  basisPath: z.string().min(1, 'Fayl yuklash majburiy'),
})

type FormValues = z.infer<typeof schema>

interface AddDelegationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddDelegationModal = ({ isOpen, onClose }: AddDelegationModalProps) => {
  const queryClient = useQueryClient()
  const { mutate: createDelegation, isPending } = useAdd('/user-delegation')

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

  const { data: committeeUsersRes } = useData<any>('/users/committee-users/select', employeeType === 'committee')
  const usersList = Array.isArray(committeeUsersRes?.data)
    ? committeeUsersRes.data
    : Array.isArray(committeeUsersRes)
      ? committeeUsersRes
      : []

  const { data: officeUsersRes } = useData<any>('/users/office-users/select', employeeType === 'office')
  const officeUsersList = Array.isArray(officeUsersRes?.data)
    ? officeUsersRes.data
    : Array.isArray(officeUsersRes)
      ? officeUsersRes
      : []

  const { data: regulatorUsersRes } = useData<any>('/users/regulator-users/select', employeeType === 'regulator')
  const regulatorUsersList = Array.isArray(regulatorUsersRes?.data)
    ? regulatorUsersRes.data
    : Array.isArray(regulatorUsersRes)
      ? regulatorUsersRes
      : []

  const activeList =
    employeeType === 'committee'
      ? usersList
      : employeeType === 'office'
        ? officeUsersList
        : employeeType === 'regulator'
          ? regulatorUsersList
          : []

  const options = activeList.map((u: any) => {
    const roleTranslation = u.role && UserRoleLabels[u.role as UserRoles] ? UserRoleLabels[u.role as UserRoles] : ''
    const unitAndRole = [u.unitName, roleTranslation].filter(Boolean).join(' ')
    const roleLabel = unitAndRole ? ` (${unitAndRole})` : ''
    return {
      id: u.id,
      name: (u.fullName || u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.id) + roleLabel,
    }
  })

  const getDelegatorOptions = () => {
    if (!employeeType) return []
    return options
  }

  const getDelegateeOptions = () => {
    if (!employeeType) return []
    return options.filter((opt: any) => opt.id !== delegatorId)
  }

  useEffect(() => {
    form.setValue('delegatorId', '')
    form.setValue('delegateeId', '')
  }, [employeeType, form])

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      startDate: format(data.startDate, 'yyyy-MM-dd'),
      endDate: format(data.endDate, 'yyyy-MM-dd'),
    }

    createDelegation(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/user-delegation'] })
        form.reset()
        onClose()
      },
    })
  }

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
