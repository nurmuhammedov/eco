import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker'
import { Textarea } from '@/shared/components/ui/textarea'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select'
import { useManagerSelect } from '@/features/application/application-detail/hooks/use-manager-select'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useState } from 'react'
import { useAttachInspector } from '@/features/application/application-detail/hooks/mutations/use-attach-inspector'
import { useParams } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

const schema = z.object({
  deadline: z.date({ message: FORM_ERROR_MESSAGES.required }),
  inspectorId: z.string({ message: FORM_ERROR_MESSAGES.required }),
  resolution: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null))
    .default(''),
})

const AttachInspectorModal = () => {
  const { user } = useAuth()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useAttachInspector()
  const { id } = useParams()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const { data: inspectorSelectData } = useInspectorSelect(true, user?.isSupervisor)
  const { data: managerSelectData } = useManagerSelect()

  const isManager = user?.role == UserRoles.HEAD
  const isRegional = user?.role == UserRoles.REGIONAL

  const selectOptions = getSelectOptions(
    isManager
      ? managerSelectData || [] // Agar isManager rost bo'lsa, shu maʼlumotni
      : isRegional
        ? inspectorSelectData || [] // Aks holda, agar isRegional rost bo'lsa, shu maʼlumotni
        : [] // Agar ikkalasi ham yolg'on bo'lsa, bo'sh massivni ol
  )

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync({
      ...data,
      deadline: formatDate(data.deadline, 'yyyy-MM-dd'),
      appealId: id,
    }).then(() => {
      setIsShow(false)
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button>Ijrochi biriktirish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-blue-400">Ijrochini belgilash</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => {
                const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                return (
                  <FormItem className="w-full">
                    <FormLabel required>Ijro muddatini belgilash </FormLabel>
                    <DatePicker
                      value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                      onChange={field.onChange}
                      placeholder="Ijro muddatini belgilash "
                    />
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={form.control}
              name="inspectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ijrochini belgilash</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ijrochini belgilash" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>{selectOptions}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boshqarma boshlig‘i rezolyutsiyasi</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={7}
                      placeholder="Boshqarma boshlig‘i rezolyutsiyasi"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AttachInspectorModal
