import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DepartmentFormValues, departmentSchema } from '../model/departments.schema'
import { useCreateDepartment, useUpdateDepartment, useGetResponsibleUsers } from '../model/use-departments'
import { Department } from '../api/departments.api'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { Button } from '@/shared/components/ui/button'
import { Loader2, UserCheck } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  data?: Department | null
}

export function DepartmentModal({ isOpen, onClose, data }: Props) {
  const isEditing = !!data

  const { data: responsibleUsers = [], isLoading: isLoadingUsers } = useGetResponsibleUsers()

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      is_active: true,
      responsible_id: null,
      responsible_username: null,
      responsible_name: null,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (data) {
        form.reset({
          name: data.name,
          is_active: data.is_active,
          responsible_id: data.responsible_id ?? null,
          responsible_username: data.responsible_username ?? null,
          responsible_name: data.responsible_name ?? null,
        })
      } else {
        form.reset({
          name: '',
          is_active: true,
          responsible_id: null,
          responsible_username: null,
          responsible_name: null,
        })
      }
    }
  }, [isOpen, data, form])

  const createMutation = useCreateDepartment()
  const updateMutation = useUpdateDepartment()

  const isPending = createMutation.isPending || updateMutation.isPending

  // Selecting a user fills the three denormalized fields at once
  const handleResponsibleChange = (userId: string) => {
    if (userId === '__clear__') {
      form.setValue('responsible_id', null)
      form.setValue('responsible_username', null)
      form.setValue('responsible_name', null)
      return
    }
    const user = responsibleUsers.find((u) => u.id === userId)
    if (user) {
      form.setValue('responsible_id', user.id)
      form.setValue('responsible_username', user.username)
      form.setValue('responsible_name', user.name)
    }
  }

  const onSubmit = (values: DepartmentFormValues) => {
    if (isEditing && data) {
      updateMutation.mutate(
        { id: data.id, data: values },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const currentResponsibleId = form.watch('responsible_id')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Bo‘limni tahrirlash' : 'Yangi bo‘lim qo‘shish'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Bo‘lim nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Masalan: Kadrlar bo‘limi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <UserCheck className="h-4 w-4" />
                Mas’ul xodim
              </FormLabel>
              <Select
                value={currentResponsibleId ?? ''}
                onValueChange={handleResponsibleChange}
                disabled={isLoadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingUsers ? 'Yuklanmoqda...' : 'Mas’ul xodimni tanlang'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__clear__">
                    <span className="text-muted-foreground italic">— Tanlanmagan —</span>
                  </SelectItem>
                  {responsibleUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <span className="font-medium">{user.name}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{user.username}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Kept in sync by handleResponsibleChange */}
              <input type="hidden" {...form.register('responsible_id')} />
              <input type="hidden" {...form.register('responsible_username')} />
              <input type="hidden" {...form.register('responsible_name')} />
            </FormItem>

            {isEditing && (
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Aktiv holati</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value ?? true} onChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
