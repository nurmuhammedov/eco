import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, ShieldCheck } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { useAdd } from '@/shared/hooks'

const schema = z.object({
  specialCode: z.string({ required_error: 'Maxsus kod kiritilishi shart' }).min(1, 'Maxsus kod kiritilishi shart'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  resultId: string
  onClose?: () => void
  trigger?: ReactNode
}

const OmbudsmanCodeModal = ({ resultId, onClose, trigger }: Props) => {
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()
  const { mutateAsync: saveCode, isPending } = useAdd(
    `/inspection-results/${resultId}/ombudsman`,
    'Ombudsman maxsus kodi muvaffaqiyatli saqlandi'
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      specialCode: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!resultId) return
    saveCode({
      specialCode: values.specialCode,
    }).then(() => {
      qc.invalidateQueries({ queryKey: ['/inspection-results'] })
      setOpen(false)
      form.reset()
      onClose?.()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <ShieldCheck className="mr-2 h-4 w-4" /> Kodni yuklash
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ombudsman maxsus kodi</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
            <FormField
              control={form.control}
              name="specialCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Maxsus kod</FormLabel>
                  <FormControl>
                    <Input placeholder="Kodni kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default OmbudsmanCodeModal
