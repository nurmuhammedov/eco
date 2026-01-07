import { useConfirmDocument } from '@/features/application/application-detail/hooks/mutations/se-confirm-document'
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

const schema = z.object({
  shouldRegister: z.enum(['true', 'false'], {
    required_error: 'Iltimos, variantlardan birini tanlang.',
  }),
})

interface ConfirmWithRegistryModalProps {
  documentId: string
}

const ConfirmWithRegistryModal: React.FC<ConfirmWithRegistryModalProps> = ({ documentId }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { id: appealId } = useParams<{ id: string }>()
  const { mutate: confirmDocument, isPending } = useConfirmDocument()
  const { data: applicationData } = useApplicationDetail()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const isDeregister = applicationData?.appealType?.startsWith('DEREGISTER')

  const onSubmit = (data: z.infer<typeof schema>) => {
    confirmDocument(
      {
        appealId,
        documentId,
        shouldRegister: data.shouldRegister === 'true',
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="success">Tasdiqlandi</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isDeregister ? 'Reyestrdan chiqarilsinmi?' : 'Reyestrga qo‘shilsinmi?'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shouldRegister"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col items-start space-y-1"
                    >
                      <FormItem className="flex flex-row items-center space-y-0 space-x-1">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">Ha</FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-row items-center space-y-0 space-x-1">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">Yo‘q</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Tasdiqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmWithRegistryModal
