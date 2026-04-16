import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, UploadCloud } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/shared/components/ui/form'
import { InputFile } from '@/shared/components/common/file-upload'
import { FileTypes } from '@/shared/components/common/file-upload/models/file-types'
import { useAdd } from '@/shared/hooks'

const schema = z.object({
  additionalFilePath: z.string({ required_error: 'Fayl yuklanishi shart' }).min(1, 'Fayl yuklanishi shart'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  resultId: string
  additionalFilePath?: string | null
  onClose?: () => void
  trigger?: ReactNode
}

const AddAdditionalFileModal = ({ resultId, additionalFilePath, onClose, trigger }: Props) => {
  const [open, setOpen] = useState(false)
  const qc = useQueryClient()

  const { mutateAsync: uploadFile, isPending } = useAdd(
    '/inspection-results/additional-file',
    'Qo‘shimcha fayl muvaffaqiyatli saqlandi!'
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      additionalFilePath: additionalFilePath || '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({ additionalFilePath: additionalFilePath || '' })
    }
  }, [open, additionalFilePath, form])

  const onSubmit = (values: FormValues) => {
    if (!resultId) return

    uploadFile({
      inspectionResultId: resultId,
      additionalFilePath: values.additionalFilePath,
    }).then(() => {
      // toast.success('Qo‘shimcha fayl muvaffaqiyatli saqlandi!', { richColors: true })
      qc.invalidateQueries({ queryKey: ['/inspection-results'] }).then((r) => console.log(r))
      setOpen(false)
      onClose?.()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
            <UploadCloud className="mr-2 h-4 w-4" /> Yuklash
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Qo‘shimcha faylni yuklash</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-6">
            <FormField
              control={form.control}
              name="additionalFilePath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fayl biriktirish</FormLabel>
                  <InputFile
                    uploadEndpoint="/attachments/inspections"
                    form={form}
                    name={field.name}
                    accept={[FileTypes.PDF]}
                    buttonText={field.value ? 'Faylni almashtirish' : 'Faylni tanlash'}
                    onUploadComplete={(url) => {
                      field.onChange(url)
                    }}
                  />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="success" disabled={isPending || !form.watch('additionalFilePath')}>
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

export default AddAdditionalFileModal
