import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRejectDocument } from '@/features/application/application-detail/hooks/mutations/use-reject-document.tsx'

const schema = z.object({
  description: z.string({ message: FORM_ERROR_MESSAGES.required }),
})

interface Props {
  documentId: any
  label: string
}

const RejectDocumentModal: FC<Props> = ({ documentId, label }) => {
  const [isShow, setIsShow] = useState(false)
  const { mutateAsync, isPending } = useRejectDocument()
  const { id } = useParams()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync({
      ...data,
      appealId: id,
      documentId,
    }).then(() => {
      setIsShow(false)
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button variant="warning">{label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Izoh</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" rows={7} placeholder="Izoh" {...field} />
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
              <Button disabled={isPending} variant="warning" type="submit">
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default RejectDocumentModal
