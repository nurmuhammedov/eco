import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog.tsx'
import { Button } from '@/shared/components/ui/button.tsx'
import { DialogClose } from '@radix-ui/react-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form.tsx'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/shared/components/ui/textarea.tsx'
import { useState } from 'react'
import { useAdd } from '@/shared/hooks/api'
import { useQueryClient } from '@tanstack/react-query'

const schema = z.object({
  description: z.string().min(1, 'Majburiy maydon!'),
})

interface Props {
  changeId: string
}

const ReturnChangeModal = ({ changeId }: Props) => {
  const [isShow, setIsShow] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useAdd(`/changes/${changeId}/return`)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
    },
  })

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync(data).then(() => {
      setIsShow(false)
      form.reset()
      void queryClient.invalidateQueries({ queryKey: ['/changes/by-belong'] })
    })
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsShow(open)
        if (!open) form.reset()
      }}
      open={isShow}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Qaytarish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>O'zgartrishga so'rovni qaytarmoqchimisiz?</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Qaytarish sababi</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={7}
                      placeholder="Qaytarish bo'yicha izohni kiriting"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <DialogClose asChild>
                <Button disabled={isPending} variant="outline" type="button">
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button disabled={isPending} type="submit" variant="destructive">
                Tasdiqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ReturnChangeModal
