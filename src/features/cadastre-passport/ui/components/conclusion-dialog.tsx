import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { InputFile } from '@/shared/components/common/file-upload'

/** The backend refuses more than this, so the picker stops before the request does. */
const MAX_FILES = 10

const schema = z.object({
  conclusion: z.string().trim().min(1),
  conclusionFilePaths: z.array(z.string()).min(1).max(MAX_FILES),
})

export type ConclusionValues = z.infer<typeof schema>

interface ConclusionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel: string
  destructive?: boolean
  isPending?: boolean
  /** Prefills the text box; the usual wording, still free to edit. */
  defaultText?: string
  onSubmit: (values: ConclusionValues) => void
}

export const ConclusionDialog = ({
  open,
  onOpenChange,
  title,
  submitLabel,
  destructive,
  isPending,
  defaultText = '',
  onSubmit,
}: ConclusionDialogProps) => {
  const form = useForm<ConclusionValues>({
    resolver: zodResolver(schema),
    defaultValues: { conclusion: defaultText, conclusionFilePaths: [] },
  })

  useEffect(() => {
    if (open) form.reset({ conclusion: defaultText, conclusionFilePaths: [] })
  }, [open, defaultText, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="conclusion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xulosa matni</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Xulosa matni..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conclusionFilePaths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xulosa</FormLabel>
                  <FormControl>
                    {/* InputFile prints the field's own error, so a FormMessage
                        here only repeats it. */}
                    <InputFile
                      multiple
                      maxFiles={MAX_FILES}
                      name={field.name}
                      form={form}
                      uploadEndpoint="/attachments/cadastre-passports"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" variant={destructive ? 'destructive' : 'default'} loading={isPending}>
                {submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
