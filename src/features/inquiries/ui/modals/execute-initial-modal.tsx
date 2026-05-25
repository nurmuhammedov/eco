import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useExecuteInitial } from '@/features/inquiries/hooks/use-inquiry-mutations'
import { InquiryAction, inquiryActionLabels } from '@/features/inquiries/model/types'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'

const schema = z.object({
  type: z.enum(['APPEAL', 'RISK_APPEAL', 'SUGGESTION']).optional(),
  action: z.enum([InquiryAction.SEND_TO_COURT, InquiryAction.REJECT, InquiryAction.REDIRECT, InquiryAction.COMPLETE], {
    required_error: FORM_ERROR_MESSAGES.required,
  }),
  initialExecutionFilePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  message: z.string().optional(),
})

interface Props {
  inquiryType?: string
}

const ExecuteInitialModal = ({ inquiryType }: Props) => {
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useExecuteInitial()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: inquiryType as any,
    },
  })

  const typeValue = form.watch('type') || inquiryType

  function onSubmit(data: z.infer<typeof schema>) {
    if (!id) return
    mutateAsync({
      id,
      data,
    }).then(() => {
      setIsShow(false)
      form.reset()
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button>Ijro etish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Ijro etish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Murojaat turi</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val)
                      form.setValue('action', undefined as any, { shouldValidate: true })
                    }}
                    value={field.value || inquiryType}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Turini tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="APPEAL">Murojaat</SelectItem>
                      <SelectItem value="RISK_APPEAL">Huquqbuzarliik xabari</SelectItem>
                      <SelectItem value="SUGGESTION">Taklif</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ijro harakati</FormLabel>
                  <Select
                    key={`action-${typeValue}-${field.value || 'empty'}`}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Ijro harakatini tanlang" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.values(InquiryAction)
                        .filter((action) => {
                          if (typeValue !== 'RISK_APPEAL' && action === InquiryAction.SEND_TO_COURT) {
                            return false
                          }
                          return true
                        })
                        .map((action) => (
                          <SelectItem key={action} value={action}>
                            {inquiryActionLabels[action] || action}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel required>
                {form.watch('action') === InquiryAction.SEND_TO_COURT ? 'Sudga tayyorlangan hujjat' : 'Asos hujjat'}
              </FormLabel>
              <InputFile
                name="initialExecutionFilePath"
                form={form}
                uploadEndpoint="/public/attachments/inquiries"
                accept={[FileTypes.IMAGE, FileTypes.PDF, FileTypes.DOC]}
                multiple={false}
                buttonText="Hujjatni yuklang"
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={5}
                      placeholder="Izoh yozing..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline" type="button">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" loading={isPending}>
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ExecuteInitialModal
