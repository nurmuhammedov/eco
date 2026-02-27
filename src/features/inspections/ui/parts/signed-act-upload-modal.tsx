import { useState, ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, UploadCloud } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { useAdd } from '@/shared/hooks'

const schema = z.object({
  signedActPath: z.string({ required_error: 'Fayl yuklanishi shart' }).min(1, 'Fayl yuklanishi shart'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  resultId: string
  signedActPath?: string | null
  onClose?: () => void
  trigger?: ReactNode
}

const SignedActUploadModal = ({ resultId, signedActPath, onClose, trigger }: Props) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()
  const { mutateAsync: uploadAct, isPending } = useAdd(
    `/inspection-results/${resultId}/signed-act`,
    t('signedActSuccessfullySaved')
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      signedActPath: signedActPath || '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({ signedActPath: signedActPath || '' })
    }
  }, [open, signedActPath, form])

  const onSubmit = (values: FormValues) => {
    if (!resultId) return
    uploadAct({
      signedActPath: values.signedActPath,
    }).then(() => {
      qc.invalidateQueries({ queryKey: ['/inspection-results'] }).then((r) => console.log(r))
      setOpen(false)
      onClose?.()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" /> {t('actions.uploadSignedAct')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('actions.uploadSignedAct')}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-6">
            <FormField
              control={form.control}
              name="signedActPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signedAct')} (PDF)</FormLabel>
                  <InputFile
                    uploadEndpoint="/attachments/inspections"
                    form={form}
                    name={field.name}
                    accept={[FileTypes.PDF]}
                    buttonText={field.value ? t('actions.edit') : t('actions.create')}
                    onUploadComplete={(url) => {
                      field.onChange(url)
                    }}
                  />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                {t('actions.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('actions.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default SignedActUploadModal
