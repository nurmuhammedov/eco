import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import DatePicker from '@/shared/components/ui/datepicker'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { InputNumber } from '@/shared/components/ui/input-number'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import type { AttendanceStaffRow } from '../api/attendance.api'
import { useSaveSchedule } from '../model/use-attendance'

const RATES = ['1', '0.75', '0.5', '0.25']

const schema = z
  .object({
    rate: z.string().min(1, FORM_ERROR_MESSAGES.required),
    daily_hours: z
      .string()
      .min(1, FORM_ERROR_MESSAGES.required)
      .refine((value) => Number(value) >= 1 && Number(value) <= 12, '1 dan 12 gacha'),
    work_start: z.string().optional(),
    work_end: z.string().optional(),
    lunch_minutes: z
      .string()
      .optional()
      .refine((value) => !value || (Number(value) >= 0 && Number(value) <= 180), '0 dan 180 gacha'),
    is_tracked: z.boolean(),
    valid_from: z.date({ message: FORM_ERROR_MESSAGES.required }),
    note: z.string().max(500).optional(),
  })
  .refine((value) => !value.work_start || !value.work_end || value.work_end > value.work_start, {
    path: ['work_end'],
    message: 'Ish tugashi boshlanishidan keyin bo‘lishi kerak',
  })

type FormValues = z.infer<typeof schema>

const firstOfMonth = () => {
  const now = new Date()

  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * An employee's rate and working hours from a given day on. Empty hours mean
 * the committee's (09:00–18:00, lunch 13:00–14:00); a part rate halves the norm.
 */
export const ScheduleDialog = ({ employee, onClose }: { employee: AttendanceStaffRow | null; onClose: () => void }) => {
  const saveMutation = useSaveSchedule()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rate: '1',
      daily_hours: '8',
      work_start: '',
      work_end: '',
      lunch_minutes: '',
      is_tracked: true,
      note: '',
    },
  })

  useEffect(() => {
    if (!employee) return

    const { schedule } = employee

    form.reset({
      rate: String(schedule.rate),
      daily_hours: String(schedule.daily_hours),
      work_start: schedule.is_default ? '' : schedule.work_start,
      work_end: schedule.is_default ? '' : schedule.work_end,
      lunch_minutes: schedule.is_default ? '' : String(schedule.lunch_minutes),
      is_tracked: schedule.is_tracked,
      valid_from: firstOfMonth(),
      note: schedule.note ?? '',
    })
  }, [employee, form])

  const onSubmit = (values: FormValues) => {
    if (!employee) return

    saveMutation.mutate(
      {
        userId: employee.id,
        data: {
          rate: Number(values.rate),
          daily_hours: Number(values.daily_hours),
          work_start: values.work_start || null,
          work_end: values.work_end || null,
          lunch_minutes: values.lunch_minutes ? Number(values.lunch_minutes) : null,
          is_tracked: values.is_tracked,
          valid_from: format(values.valid_from, 'yyyy-MM-dd'),
          note: values.note?.trim() || null,
        },
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Dialog open={!!employee} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ish grafigi va stavka</DialogTitle>
        </DialogHeader>

        {employee && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="bg-muted/50 rounded-md border p-3 text-sm">
                <p className="font-medium">{employee.name}</p>
                <p className="text-muted-foreground">
                  {employee.division_name}
                  {employee.position ? ` · ${employee.position}` : ''}
                </p>
              </div>

              <FormField
                control={form.control}
                name="is_tracked"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-3 space-y-0 rounded-md border p-3">
                    <div>
                      <FormLabel>Davomatga kiradi</FormLabel>
                      <p className="text-muted-foreground text-xs">
                        O‘chirilsa xodim tabel va hisobotlarda ko‘rsatilmaydi
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Stavka</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(rate) => {
                          field.onChange(rate)
                          // A rate brings its usual norm; HR may still put another one
                          form.setValue('daily_hours', String(Math.max(1, Math.round(Number(rate) * 8))))
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RATES.map((rate) => (
                            <SelectItem key={rate} value={rate}>
                              {rate}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="daily_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Kunlik norma (soat)</FormLabel>
                      <FormControl>
                        <InputNumber allowDecimals={false} allowNegative={false} min={1} max={12} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="work_start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ish boshlanishi</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="work_end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ish tugashi</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lunch_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tushlik (daq.)</FormLabel>
                      <FormControl>
                        <InputNumber
                          allowDecimals={false}
                          allowNegative={false}
                          min={0}
                          max={180}
                          placeholder="60"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Bo‘sh qolsa umumiy tartib: 09:00–18:00, tushlik 13:00–14:00.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="valid_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Amal qilish sanasi</FormLabel>
                      <DatePicker value={field.value} onChange={field.onChange} />
                      <FormMessage />
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
                        <Input maxLength={500} placeholder="Masalan: buyruq raqami" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                O‘zgarish shu sanadan boshlab amal qiladi; oldingi oylar hisobi o‘zgarmaydi.
              </p>

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
