import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload'
import useAdd from '@/shared/hooks/api/useAdd'
import { useNavigate } from 'react-router-dom'

const deregisterSchema = z.object({
  deregisterReason: z.string({ message: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  deregisterBasisPath: z.string({ message: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
})

type DeregisterFormValues = z.infer<typeof deregisterSchema>

interface DeregisterModalProps {
  isOpen: boolean
  onClose: () => void
  endpoint: string
  onSuccess?: () => void
}

export const DeregisterModal = ({ isOpen, onClose, endpoint, onSuccess }: DeregisterModalProps) => {
  const navigate = useNavigate()
  const form = useForm<DeregisterFormValues>({
    resolver: zodResolver(deregisterSchema),
    defaultValues: {
      deregisterReason: '',
      deregisterBasisPath: '',
    },
  })

  const { mutate, isPending } = useAdd<DeregisterFormValues, any, any>(
    endpoint,
    'So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!'
  )

  const onSubmit = (values: DeregisterFormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose()
        onSuccess?.()
        form.reset()
        navigate(-1)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reyestrdan chiqarish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="deregisterReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Reyestrdan chiqarish sababi</FormLabel>
                  <FormControl>
                    <Textarea rows={7} placeholder="Sababni kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deregisterBasisPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Reyestrdan chiqarish asosi</FormLabel>
                  <FormControl>
                    <InputFile name={field.name} form={form} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending}>
                Yuborish
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
