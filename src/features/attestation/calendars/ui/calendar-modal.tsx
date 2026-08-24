import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, isToday, parseISO } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import DatePicker from '@/shared/components/ui/datepicker'
import { EMPLOYEE_TYPE_OPTIONS } from '@/entities/attestation/model/labels'
import type { AttestationCalendar } from '@/entities/attestation/model/types'
import { useCreateCalendar, useUpdateCalendar } from '../model/use-calendars'

const schema = z
  .object({
    date: z.date({ required_error: 'Majburiy maydon!' }),
    start_time: z.string().min(1, 'Majburiy maydon!'),
    end_time: z.string().min(1, 'Majburiy maydon!'),
    employee_type: z.enum(['LEADER', 'ENGINEER'], { required_error: 'Majburiy maydon!' }),
    capacity: z.coerce
      .number()
      .int('Kiritilgan ma’lumot yaroqli emas!')
      .min(1, 'Majburiy maydon!')
      .max(100, 'Bitta qabul vaqtiga ko‘pi bilan 100 ta xodim belgilanadi.'),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: 'Kiritilgan ma’lumot yaroqli emas!',
    path: ['end_time'],
  })
  .refine((data) => !isToday(data.date) || data.start_time > format(new Date(), 'HH:mm'), {
    message: 'Kiritilgan ma’lumot yaroqli emas!',
    path: ['start_time'],
  })

type FormValues = z.infer<typeof schema>

interface Props {
  isOpen: boolean
  onClose: () => void
  editData?: AttestationCalendar | null
  defaultDate?: Date
}

// The API takes full timestamps, the form collects a date and two times.
const toIso = (date: Date, time: string) => `${format(date, 'yyyy-MM-dd')} ${time}:00`

export function CalendarModal({ isOpen, onClose, editData, defaultDate }: Props) {
  const isEditing = !!editData
  const createMutation = useCreateCalendar()
  const updateMutation = useUpdateCalendar()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultDate ?? new Date(),
      start_time: '10:00',
      end_time: '12:00',
      employee_type: 'LEADER',
      capacity: 1,
    },
  })

  useEffect(() => {
    if (!isOpen) return

    if (editData) {
      const start = parseISO(editData.start_date)
      const end = parseISO(editData.end_date)

      form.reset({
        date: start,
        start_time: format(start, 'HH:mm'),
        end_time: format(end, 'HH:mm'),
        employee_type: editData.employee_type,
        capacity: editData.capacity,
      })
    } else {
      form.reset({
        date: defaultDate ?? new Date(),
        start_time: '10:00',
        end_time: '12:00',
        employee_type: 'LEADER',
        capacity: 1,
      })
    }
  }, [isOpen, editData, defaultDate, form])

  const takenSeats = editData ? editData.capacity - editData.remaining_capacity : 0

  const onSubmit = (values: FormValues) => {
    if (values.capacity < takenSeats) {
      form.setError('capacity', {
        message: `Kamida ${takenSeats} ta bo‘lishi kerak — shuncha joy allaqachon band.`,
      })

      return
    }

    const payload = {
      start_date: toIso(values.date, values.start_time),
      end_date: toIso(values.date, values.end_time),
      employee_type: values.employee_type,
      capacity: values.capacity,
    }

    if (isEditing && editData) {
      updateMutation.mutate({ id: editData.id, data: payload }, { onSuccess: onClose })
    } else {
      createMutation.mutate(payload, { onSuccess: onClose })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Qabul vaqtini tahrirlash' : 'Yangi qabul vaqti'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel required>Sana</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} disableStrategy="before" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Boshlanishi</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Tugashi</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="employee_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Xodim turi</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EMPLOYEE_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Nechta xodim qabul qilinadi</FormLabel>
                  <FormControl>
                    <Input type="number" inputMode="numeric" {...field} />
                  </FormControl>
                  {takenSeats > 0 && (
                    <p className="text-muted-foreground text-xs">
                      Ayni paytda {takenSeats} ta joy band — undan kam qilib bo‘lmaydi.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-muted-foreground text-xs">
              Saqlangach ushbu vaqt uchun Zoom havolasi avtomatik yaratiladi.
            </p>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
