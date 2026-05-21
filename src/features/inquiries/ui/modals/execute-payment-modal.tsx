import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Textarea } from '@/shared/components/ui/textarea'
import { InputNumber } from '@/shared/components/ui/input-number'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useExecutePayment } from '@/features/inquiries/hooks/use-inquiry-mutations'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'

const schema = z
  .object({
    isPaid: z.string({ required_error: FORM_ERROR_MESSAGES.required }).transform((val) => val === 'true'),
    rewardAmount: z.number({ required_error: FORM_ERROR_MESSAGES.required }).optional().nullable(),
    rejectReason: z.string({ required_error: FORM_ERROR_MESSAGES.required }).optional().nullable(),
    paymentExecutionFilePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  })
  .superRefine((data, ctx) => {
    if (data.isPaid === true) {
      if (data.rewardAmount === undefined || data.rewardAmount === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: FORM_ERROR_MESSAGES.required,
          path: ['rewardAmount'],
        })
      }
    } else if (data.isPaid === false) {
      if (!data.rejectReason || data.rejectReason.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: FORM_ERROR_MESSAGES.required,
          path: ['rejectReason'],
        })
      }
    }
  })

const ExecutePaymentModal = () => {
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useExecutePayment()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const isPaidWatch = useWatch({
    control: form.control,
    name: 'isPaid',
  })

  // To properly watch boolean transformed from string in Select
  const isPaid = isPaidWatch !== undefined ? Boolean(isPaidWatch) : undefined

  function onSubmit(data: any) {
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
          <DialogTitle className="text-[#4E75FF]">To‘lov ijrosini kiritish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel required>To‘lov natijasi</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value !== undefined ? String(field.value) : undefined}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer font-normal">To‘landi</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer font-normal">To‘lanmadi</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isPaid === true && (
              <FormField
                control={form.control}
                name="rewardAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>To‘lov miqdori (So‘m)</FormLabel>
                    <FormControl>
                      <InputNumber name={field.name} control={form.control} placeholder="To‘lov miqdorini kiriting" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isPaid === false && (
              <FormField
                control={form.control}
                name="rejectReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>To‘lanmaslik sababi</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        rows={4}
                        placeholder="Sababni yozing..."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <InputFile
              name="paymentExecutionFilePath"
              form={form}
              uploadEndpoint="/public/attachments/inquiries"
              accept={[FileTypes.IMAGE, FileTypes.PDF, FileTypes.DOC]}
              multiple={false}
              buttonText="To‘lov hujjati faylini yuklang"
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

export default ExecutePaymentModal
