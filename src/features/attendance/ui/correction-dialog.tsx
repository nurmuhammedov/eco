import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import type { AttendanceStatus, CorrectionStatus } from '../api/attendance.api'
import { CORRECTION_STATUS_LABELS, formatDate, STATUS_LABELS } from '../model/attendance-labels'
import { useSaveCorrection } from '../model/use-attendance'

/** The day HR is deciding on, with what the terminals said about it */
export interface CorrectionTarget {
  userId: string
  name: string
  date: string
  status: AttendanceStatus
  checkIn?: string | null
  checkOut?: string | null
}

const schema = z
  .object({
    status: z.enum(['PRESENT', 'ABSENT', 'BUSINESS_TRIP', 'LEAVE']),
    check_in: z.string().optional(),
    check_out: z.string().optional(),
    reason: z.string({ message: FORM_ERROR_MESSAGES.required }).trim().min(1, FORM_ERROR_MESSAGES.required).max(500),
  })
  .refine(
    (value) => value.status !== 'PRESENT' || !value.check_in || !value.check_out || value.check_out > value.check_in,
    {
      path: ['check_out'],
      message: 'Ketgan vaqti kelgan vaqtidan keyin bo‘lishi kerak',
    }
  )

type FormValues = z.infer<typeof schema>

/** A day without an exit is most often confirmed as worked */
const initialStatus = (status: AttendanceStatus): CorrectionStatus =>
  status === 'ABSENT' || status === 'BUSINESS_TRIP' || status === 'LEAVE' ? status : 'PRESENT'

/**
 * HR's decision on one day: confirm a day without an exit with the time the
 * employee left, or set it as absent, a business trip or a leave.
 */
export const CorrectionDialog = ({ target, onClose }: { target: CorrectionTarget | null; onClose: () => void }) => {
  const saveMutation = useSaveCorrection()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'PRESENT', check_in: '', check_out: '', reason: '' },
  })

  useEffect(() => {
    if (!target) return

    form.reset({
      status: initialStatus(target.status),
      check_in: target.checkIn ?? '',
      check_out: target.checkOut ?? '',
      reason: '',
    })
  }, [target, form])

  const isPresent = form.watch('status') === 'PRESENT'

  const onSubmit = (values: FormValues) => {
    if (!target) return

    const present = values.status === 'PRESENT'

    saveMutation.mutate(
      {
        user_id: target.userId,
        date: target.date,
        status: values.status,
        check_in: present ? values.check_in || null : null,
        check_out: present ? values.check_out || null : null,
        reason: values.reason,
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kun holatini tuzatish</DialogTitle>
        </DialogHeader>

        {target && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-muted/50 space-y-1 rounded-md border p-3 text-sm">
                <p>
                  <span className="text-muted-foreground">Xodim:</span> {target.name}
                </p>
                <p>
                  <span className="text-muted-foreground">Sana:</span> {formatDate(target.date)}
                </p>
                <p>
                  <span className="text-muted-foreground">FaceID bo‘yicha:</span> {STATUS_LABELS[target.status]}
                  {(target.checkIn || target.checkOut) && ` (${target.checkIn ?? '—'} – ${target.checkOut ?? '—'})`}
                </p>
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Holati</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.keys(CORRECTION_STATUS_LABELS) as CorrectionStatus[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {CORRECTION_STATUS_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isPresent && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="check_in"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kelgan vaqti</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="check_out"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ketgan vaqti</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Bo‘sh qolsa FaceID vaqtlari olinadi; ular ham bo‘lmasa to‘liq ish kuni hisoblanadi.
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Sababi</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        placeholder="Masalan: chiqishda qurilma ishlamagan, rahbar tasdiqladi"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={saveMutation.isPending}>
                  Bekor qilish
                </Button>
                <Button type="submit" loading={saveMutation.isPending}>
                  Saqlash
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
