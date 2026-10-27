import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { InputFile } from '@/shared/components/common/file-upload'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useRefreshPassport } from '../../model/use-cadastre-passport'

const schema = z.object({
  passportFile: z.string().min(1, FORM_ERROR_MESSAGES.required),
})

type FormValues = z.infer<typeof schema>

interface PassportFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passportId: string
}

/**
 * Replaces the cadastre passport file. The backend allows it only to the
 * preparing organisation (or its representative) while the passport is NEW,
 * i.e. until the customer approves it; the old file is removed there.
 */
export const PassportFileDialog = ({ open, onOpenChange, passportId }: PassportFileDialogProps) => {
  const refreshPassport = useRefreshPassport()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { passportFile: '' },
  })

  useEffect(() => {
    if (open) form.reset({ passportFile: '' })
  }, [open, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (passportFilePath: string) =>
      apiClient.put(`/cadastre-passports/${passportId}/passport-file`, { passportFilePath }),
    onSuccess: async () => {
      await refreshPassport()
      toast.success('Kadastr pasporti fayli yangilandi')
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kadastr pasporti faylini almashtirish</DialogTitle>
          <DialogDescription>
            Yangi fayl eskisining o‘rniga saqlanadi. Buyurtmachi tasdiqlagandan keyin faylni o‘zgartirib bo‘lmaydi.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(({ passportFile }) => mutate(passportFile))} className="space-y-4">
            <FormField
              control={form.control}
              name="passportFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Kadastr pasporti fayli</FormLabel>
                  <FormControl>
                    <InputFile
                      name={field.name as 'passportFile'}
                      form={form}
                      uploadEndpoint="/attachments/cadastre-passports"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending} disabled={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
