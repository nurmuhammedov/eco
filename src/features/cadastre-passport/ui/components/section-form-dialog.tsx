import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form } from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { FVV_GROUPS, SES_GROUPS, fromReviewPayload, reviewShape, toReviewPayload } from '../../model/review-fields'
import { CadastreSection, WorkflowSlot } from '../../model/types'
import { ReviewDataFields } from './review-data-fields'

interface SectionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passportId: string
  slot: WorkflowSlot
  data: CadastreSection | null | undefined
  onSaved: () => void
}

export const SectionFormDialog = ({ open, onOpenChange, passportId, slot, data, onSaved }: SectionFormDialogProps) => {
  const groups = slot === 'FVV' ? FVV_GROUPS : SES_GROUPS
  const schema = useMemo(() => z.object(reviewShape(groups)), [groups])

  const form = useForm<Record<string, unknown>>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) form.reset(fromReviewPayload(groups, data))
  }, [open, groups, data, form])

  const { mutate, isPending } = useMutation({
    // The section is replaced whole, so a field left blank is cleared on the server.
    mutationFn: (values: Record<string, unknown>) =>
      apiClient.put(
        `/cadastre-passports/${passportId}/workflow/${slot.toLowerCase()}-data`,
        toReviewPayload(groups, values)
      ),
    onSuccess: () => {
      toast.success('Ma’lumotlar saqlandi')
      onSaved()
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size={slot === 'FVV' ? 'full' : 'xl'}>
        <DialogHeader>
          <DialogTitle>{slot === 'FVV' ? 'FVV ma’lumotlarini kiritish' : 'SES ma’lumotlarini kiritish'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-6">
            <ReviewDataFields control={form.control} groups={groups} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" loading={isPending}>
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
