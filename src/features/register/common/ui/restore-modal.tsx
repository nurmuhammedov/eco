import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
import { InputFile } from '@/shared/components/common/file-upload/ui/file-upload'
import useAdd from '@/shared/hooks/api/use-add'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { invalidateRegistryQueries } from '@/shared/lib/query/invalidate-registry'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

const restoreSchema = z.object({
  restoreReason: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1),
  restoreBasisPath: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1),
})

type RestoreFormValues = z.infer<typeof restoreSchema>

interface RestoreModalProps {
  /** `/hf/{id}/restore` or `/equipments/{id}/restore` */
  endpoint: string
  /** The committee returned the request and it is being sent again */
  isResubmit?: boolean
  onSuccess?: () => void
  /** Controlled by the caller's own button; leave out to render the trigger below instead */
  isOpen?: boolean
  onClose?: () => void
  /** Text of the trigger button the modal renders itself when not controlled */
  buttonText?: string
}

/** Asks the committee to put a deregistered HF or equipment back in the registry */
export const RestoreModal = ({ endpoint, isResubmit, onSuccess, isOpen, onClose, buttonText }: RestoreModalProps) => {
  const queryClient = useQueryClient()
  const isControlled = isOpen !== undefined
  const [isOwnOpen, setIsOwnOpen] = useState(false)
  const open = isControlled ? isOpen : isOwnOpen

  const form = useForm<RestoreFormValues>({
    resolver: zodResolver(restoreSchema),
    defaultValues: {
      restoreReason: '',
      restoreBasisPath: '',
    },
  })

  // Every close starts the next attempt empty: re-sending an old path makes the backend delete that file
  useEffect(() => {
    if (!open) form.reset()
  }, [open, form])

  const { mutate, isPending } = useAdd<RestoreFormValues>(
    endpoint,
    'Reyestrga qaytarish so‘rovi qo‘mita mas’ul xodimiga yuborildi.'
  )

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setIsOwnOpen(next)
    if (!next) onClose?.()
  }

  const onSubmit = (values: RestoreFormValues) => {
    mutate(values, {
      onSuccess: () => {
        // The card and the change page read the request, its logs and the registers
        invalidateEndpoint(queryClient, '/changes/by-belong')
        invalidateEndpoint(queryClient, '/change-logs')
        invalidateEndpoint(queryClient, '/execution-processes/change')
        invalidateRegistryQueries(queryClient)
        handleOpenChange(false)
        onSuccess?.()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="success">{buttonText}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isResubmit ? 'Reyestrga qaytarish so‘rovini qayta yuborish' : 'Reyestrga qaytarish'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="restoreReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Reyestrga qaytarish sababi</FormLabel>
                  <FormControl>
                    <Textarea rows={7} placeholder="Sababni kiriting..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="restoreBasisPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Reyestrga qaytarish asosi</FormLabel>
                  <FormControl>
                    <InputFile name={field.name} form={form} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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
