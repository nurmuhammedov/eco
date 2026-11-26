import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Combobox } from '@/shared/components/ui/combobox'
import DatePicker from '@/shared/components/ui/datepicker'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import type { AbsenceType, AttendanceAbsence } from '../api/attendance.api'
import { ABSENCE_TYPE_LABELS } from '../model/attendance-labels'
import { useAttendanceStaff, useSaveAbsence } from '../model/use-attendance'

const schema = z
  .object({
    user_id: z.string({ message: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
    type: z.enum(['BUSINESS_TRIP', 'LEAVE']),
    date_from: z.date({ message: FORM_ERROR_MESSAGES.required }),
    date_to: z.date({ message: FORM_ERROR_MESSAGES.required }),
    include_weekends: z.boolean(),
    note: z.string().max(500).optional(),
  })
  .refine((value) => value.date_to >= value.date_from, {
    path: ['date_to'],
    message: 'Tugash sanasi boshlanishidan oldin bo‘lmasin',
  })

type FormValues = z.infer<typeof schema>

/** "2026-11-04" as a local date, the way DatePicker holds it */
const toDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)

  return new Date(year, month - 1, day)
}

/** A business trip (X) or a study / leave (O‘) of one employee for a range of days */
export const AbsenceDialog = ({
  isOpen,
  onClose,
  absence,
}: {
  isOpen: boolean
  onClose: () => void
  absence?: AttendanceAbsence | null
}) => {
  const { data: staff = [], isLoading } = useAttendanceStaff({}, isOpen)
  const saveMutation = useSaveAbsence()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { user_id: '', type: 'BUSINESS_TRIP', include_weekends: false, note: '' },
  })

  useEffect(() => {
    if (!isOpen) return

    form.reset(
      absence
        ? {
            user_id: absence.user_id,
            type: absence.type,
            date_from: toDate(absence.date_from),
            date_to: toDate(absence.date_to),
            include_weekends: absence.include_weekends,
            note: absence.note ?? '',
          }
        : {
            user_id: '',
            type: 'BUSINESS_TRIP',
            date_from: undefined,
            date_to: undefined,
            include_weekends: false,
            note: '',
          }
    )
  }, [isOpen, absence, form])

  const options = useMemo(
    () => staff.map((employee) => ({ id: employee.id, name: `${employee.name} — ${employee.division_name ?? ''}` })),
    [staff]
  )

  const onSubmit = (values: FormValues) =>
    saveMutation.mutate(
      {
        id: absence?.id,
        data: {
          user_id: values.user_id,
          type: values.type,
          date_from: format(values.date_from, 'yyyy-MM-dd'),
          date_to: format(values.date_to, 'yyyy-MM-dd'),
          include_weekends: values.include_weekends,
          note: values.note?.trim() || null,
        },
      },
      { onSuccess: onClose }
    )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{absence ? 'Sababli yo‘qlikni tahrirlash' : 'Sababli yo‘qlik qo‘shish'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xodim</FormLabel>
                  <Combobox
                    options={options}
                    value={field.value}
                    onChange={(value) => field.onChange(String(value))}
                    placeholder={isLoading ? 'Yuklanmoqda...' : 'Xodimni tanlang'}
                    searchPlaceholder="F.I.Sh."
                    disabled={isLoading || !!absence}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Turi</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(ABSENCE_TYPE_LABELS) as AbsenceType[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {ABSENCE_TYPE_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="date_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Boshlanishi</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Tugashi</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="include_weekends"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  </FormControl>
                  <FormLabel className="font-normal">Oraliqdagi shanba va yakshanba ham hisoblansin</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Izoh</FormLabel>
                  <FormControl>
                    <Textarea rows={2} maxLength={500} placeholder="Masalan: buyruq raqami va sanasi" {...field} />
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
      </DialogContent>
    </Dialog>
  )
}
