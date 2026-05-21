import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Textarea } from '@/shared/components/ui/textarea'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useExecuteCourt } from '@/features/inquiries/hooks/use-inquiry-mutations'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'

const schema = z.object({
  isPositive: z.enum(['true', 'false'], { required_error: FORM_ERROR_MESSAGES.required }),
  courtExecutionFilePath: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
  message: z.string().optional(),
})

const ExecuteCourtModal = () => {
  const { id } = useParams()
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useExecuteCourt()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: any) {
    if (!id) return
    mutateAsync({
      id,
      data: {
        ...data,
        isPositive: data.isPositive === 'true',
      },
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
          <DialogTitle className="text-[#4E75FF]">Sud ijrosini kiritish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isPositive"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel required>Sud qarori natijasi</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer font-normal">Ijobiy</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer font-normal">Salbiy</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <InputFile
              name="courtExecutionFilePath"
              form={form}
              uploadEndpoint="/public/attachments/inquiries"
              accept={[FileTypes.IMAGE, FileTypes.PDF, FileTypes.DOC]}
              multiple={false}
              buttonText="Sud qarori faylini yuklang"
            />

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
                      placeholder="Qo‘shimcha izoh yozing..."
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

export default ExecuteCourtModal
