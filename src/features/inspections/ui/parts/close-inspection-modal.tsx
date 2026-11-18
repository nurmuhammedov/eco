import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { Ban, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
import { InputFile } from '@/shared/components/common/file-upload'
import FileLink from '@/shared/components/common/file-link'
import { useAdd } from '@/shared/hooks'
import { invalidateCloseRequest, type CloseSending } from '@/features/inspections/model/close-request'

const schema = z.object({
  basisPath: z.string().min(1),
  comment: z.string(),
})

type FormValues = z.infer<typeof schema>

/** `POST /inspections/{id}/close-request` */
interface CloseRequestBody {
  basisPath: string
  comment?: string
}

interface Props {
  inspectionId: string
  /** The MANAGER returned the request and the region sends it again */
  isResubmit?: boolean
  /** What the returned request was sent with */
  previous?: CloseSending
}

/**
 * The region asks the committee to close an inspection that cannot be
 * conducted. The inspection stays as it is until the MANAGER confirms.
 */
export const CloseInspectionModal = ({ inspectionId, isResubmit = false, previous }: Props) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { basisPath: '', comment: '' },
  })
  const basisPath = useWatch({ control: form.control, name: 'basisPath' })

  const previousComment = previous?.comment ?? ''

  // The file is always picked anew: sending a stored path again may make the backend drop that file
  useEffect(() => {
    if (open) form.reset({ basisPath: '', comment: isResubmit ? previousComment : '' })
  }, [open, isResubmit, previousComment, form])

  const { mutate, isPending } = useAdd<CloseRequestBody>(
    `/inspections/${inspectionId}/close-request`,
    'Tekshiruvni yakunlash bo‘yicha so‘rov yuborildi'
  )

  const onSubmit = ({ basisPath, comment }: FormValues) => {
    mutate(
      { basisPath, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          invalidateCloseRequest(queryClient)
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isResubmit ? (
          <Button variant="success">
            <Send className="h-4 w-4" /> Qayta yuborish
          </Button>
        ) : (
          <Button variant="destructiveOutline">
            <Ban className="h-4 w-4" /> Yakunlash
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isResubmit ? 'Yakunlash so‘rovini qayta yuborish' : 'Tekshiruvni o‘tkazmasdan yakunlash'}
          </DialogTitle>
          <DialogDescription>
            So‘rov qo‘mitaning mas’ul xodimiga yuboriladi. Tekshiruv u tasdiqlagandan keyingina yopiladi.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="basisPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yakunlashga asos</FormLabel>
                  <FormControl>
                    <InputFile name={field.name} form={form} uploadEndpoint="/attachments/inspections" />
                  </FormControl>
                  {isResubmit && previous?.basisPath && (
                    <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      Oldin yuborilgan asos:
                      <FileLink url={previous.basisPath} isSmall />
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Nima sababdan tekshiruvni o‘tkazib bo‘lmaydi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="destructive" loading={isPending} disabled={!basisPath}>
                {isResubmit ? 'Qayta yuborish' : 'Yakunlash'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
