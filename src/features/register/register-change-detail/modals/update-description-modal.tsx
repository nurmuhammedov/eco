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
  desc?: string
}

const UpdateDescriptionModal = ({ changeId, desc = '' }: Props) => {
  const [isShow, setIsShow] = useState(false)
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useAdd(`/changes/${changeId}/description`)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: desc || '',
    },
  })

  function onSubmit(data: z.infer<typeof schema>) {
    mutateAsync(data).then(() => {
      setIsShow(false)
      void queryClient.invalidateQueries({ queryKey: ['/changes/by-belong'] })
    })
  }

  return (
    <Dialog onOpenChange={setIsShow} open={isShow}>
      <DialogTrigger asChild>
        <Button>Izoh yozish</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-[#4E75FF]">Ijro natijasi bo‘yicha izoh</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Izoh</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={7}
                      placeholder="Ijro natijasi bo‘yicha izohni kiriting"
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

export default UpdateDescriptionModal
