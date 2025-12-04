import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDate, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker.tsx'
import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { getSelectOptions } from '@/shared/lib/get-select-options.tsx'
import { useInspectorSelect } from '@/features/application/application-detail/hooks/use-inspector-select.tsx'
import { useManagerSelect } from '@/features/application/application-detail/hooks/use-manager-select.tsx'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useState } from 'react'
import { useAttachInspector } from '@/features/application/application-detail/hooks/mutations/use-attach-inspector.tsx'
import { useParams } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth.ts'

const schema = z.object({
  deadline: z.date({ message: FORM_ERROR_MESSAGES.required }),
  inspectorId: z.string({ message: FORM_ERROR_MESSAGES.required }),
  resolution: z.string().optional().default(''),
})

const AttachInspectorModal = () => {
  const { user } = useAuth()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useAttachInspector()
  const { id } = useParams()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const { data: inspectorSelectData } = useInspectorSelect()
  const { data: managerSelectData } = useManagerSelect()

  const isManager = user?.role == UserRoles.HEAD
  const isRegional = user?.role == UserRoles.REGIONAL

  const selectOptions = getSelectOptions(
    isManager
      ? managerSelectData || [] // Agar isManager rost bo'lsa, shu ma'lumotni
      : isRegional
        ? inspectorSelectData || [] // Aks holda, agar isRegional rost bo'lsa, shu ma'lumotni
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
        <Button> Ijro etish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Ijrochini belgilash</DialogTitle>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AttachInspectorModal
