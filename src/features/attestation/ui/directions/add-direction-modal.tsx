import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDirection } from '@/entities/attestation/api/attestation.api'
import { directionSchema } from '@/entities/attestation/model/schema'
import { CreateDirectionPayload } from '@/entities/attestation/model/types'
import { toast } from 'sonner'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'

interface AddDirectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddDirectionModal: FC<AddDirectionModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient()
  const form = useForm<CreateDirectionPayload>({
    resolver: zodResolver(directionSchema),
    defaultValues: {
      name: '',
      is_active: true,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createDirection,
    onSuccess: () => {
      toast.success('Muvaffaqiyatli saqlandi')
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.DIRECTIONS] })
      form.reset()
      onClose()
    },
    onError: () => {
      toast.error('Xatolik yuz berdi')
    },
  })

  const onSubmit = (data: CreateDirectionPayload) => {
    mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yangi yo'nalish qo'shish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yo'nalish nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Nomini kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Holati</FormLabel>
                    <div className="text-muted-foreground text-sm">{field.value ? 'Aktiv' : 'Nofaol'}</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending} disabled={isPending}>
                Saqlash
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
