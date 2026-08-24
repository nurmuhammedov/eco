import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload'
import useAdd from '@/shared/hooks/api/useAdd'
import { useNavigate } from 'react-router-dom'

const changeStatusSchema = z.object({
  reason: z.string({ message: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  basisFilePath: z.string({ message: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
})

type ChangeStatusFormValues = z.infer<typeof changeStatusSchema>

interface ChangeStatusModalProps {
  isOpen: boolean
  onClose: () => void
  endpoint: string
  onSuccess?: () => void
  targetStatus: 'VALID' | 'INVALID'
  type?: 'EQUIPMENT' | 'HF'
}

export const ChangeStatusModal = ({
  isOpen,
  onClose,
  endpoint,
  onSuccess,
  targetStatus,
  type = 'EQUIPMENT',
}: ChangeStatusModalProps) => {
  const navigate = useNavigate()
  const form = useForm<ChangeStatusFormValues>({
    resolver: zodResolver(changeStatusSchema),
    defaultValues: {
      reason: '',
      basisFilePath: '',
    },
  })

  const { mutate, isPending } = useAdd<ChangeStatusFormValues & { targetStatus: string }, any, any>(
    endpoint,
    'So‘rov masʼul xodimga yuborildi. O‘zgarishlar tasdiqlangandan so‘ng ko‘rinadi!'
  )

  const onSubmit = (values: ChangeStatusFormValues) => {
    mutate(
      { ...values, targetStatus },
      {
        onSuccess: () => {
          onClose()
          onSuccess?.()
          form.reset()
          navigate(-1)
        },
      }
    )
  }

  const isRestoring = targetStatus === 'VALID'

  const getTitle = () => {
    if (type === 'HF') {
      return isRestoring ? 'Faolga o‘tkazish' : 'Vaqtinchalik nofaolga o‘tkazish'
    }
    return isRestoring ? 'Sozga o‘tkazish' : 'Vaqtinchalik nosozga o‘tkazish'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{getTitle()} sababi</FormLabel>
                  <FormControl>
                    <Textarea rows={7} placeholder="Sababni kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basisFilePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{getTitle()} asosi</FormLabel>
                  <FormControl>
                    <InputFile name={field.name} form={form} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending}>
                Yuborish
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
