import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Edit2 } from 'lucide-react'
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
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useRegionSelectQuery } from '@/entities/admin/districts'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { useChangeInquiryRegion } from '@/features/inquiries/hooks/use-inquiry-mutations'

const schema = z.object({
  regionId: z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
})

interface ChangeRegionModalProps {
  inquiryId: string
  currentRegionId?: number | null
}

export const ChangeRegionModal = ({ inquiryId, currentRegionId }: ChangeRegionModalProps) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync, isPending } = useChangeInquiryRegion()
  const { data: regions } = useRegionSelectQuery()

  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

  // Sending it back to where it already is would be a no-op the user cannot see.
  const options = getSelectOptions(
    (Array.isArray(regions) ? regions : []).filter((region) => Number(region?.id) !== Number(currentRegionId))
  )

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await mutateAsync({ id: inquiryId, data: { regionId: Number(values.regionId) } })

    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-900"
          title="Hududni o‘zgartirish"
        >
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Hududni o‘zgartirish</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hududni o‘zgartirish</DialogTitle>
          <DialogDescription>Murojaat tanlangan hududga o‘tkaziladi!</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Yangi hudud</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hududni tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>{options}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending} loading={isPending}>
                O‘zgartirish
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
