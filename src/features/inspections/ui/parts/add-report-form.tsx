import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'
import DatePicker from '@/shared/components/ui/datepicker.tsx'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useState } from 'react'

import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { useAddInspectionReport } from '@/features/inspections/hooks/use-add-inspection-report.ts'

const schema = z.object({
  deadline: z.date({ message: FORM_ERROR_MESSAGES.required }),
  defect: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
})

const AddReportForm = () => {
  const [isShow, setIsShow] = useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })
  const { mutateAsync, isPending } = useAddInspectionReport()

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync({
      ...data,
      deadline: format(data.deadline, 'yyyy-MM-dd'),
    }).then(() => {
      form.reset()
      setIsShow(false)
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button size="sm">Kamchiliklarni qo'shish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Kamchiliklarni qo'shish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-2 grid grid-cols-1 gap-2">
              <div>
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => {
                    const dateValue = typeof field.value === 'string' ? parseISO(field.value) : field.value
                    return (
                      <FormItem className="w-full">
                        <FormLabel required>Bartaraf etish muddati</FormLabel>
                        <DatePicker
                          value={dateValue instanceof Date && !isNaN(dateValue.valueOf()) ? dateValue : undefined}
                          onChange={field.onChange}
                          placeholder="Bartaraf etish muddati"
                        />
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
              </div>
              <div>
                <FormField
                  name="defect"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Kamchilikning tavsifi</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[150px] resize-none" {...field}></Textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DialogClose disabled={isPending} asChild>
                <Button variant="outline">Bekor qilish</Button>
              </DialogClose>
              <Button disabled={isPending} type="submit">
                Qo'shish
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddReportForm
