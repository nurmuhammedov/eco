import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addDays, format, isToday, parseISO, startOfToday } from 'date-fns'
import { Loader2, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DatePicker from '@/shared/components/ui/datepicker'
import { EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationApplication, AttestationCalendar } from '@/entities/attestation/model/types'
import { useCreateExam, useUpdateExam } from '../model/use-calendars'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

const schema = z
  .object({
    date: z.date(),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: FORM_ERROR_MESSAGES.invalid,
    path: ['end_time'],
  })
  .refine((data) => !isToday(data.date) || data.start_time > format(new Date(), 'HH:mm'), {
    message: FORM_ERROR_MESSAGES.invalid,
    path: ['start_time'],
  })

type FormValues = z.infer<typeof schema>

type Props = {
  isOpen: boolean
  onClose: () => void
} & (
  | {
      /** Queued applications the new exam is built from */
      applications: AttestationApplication[]
      editData?: never
      onCreated?: () => void
    }
  | { editData: AttestationCalendar | null; applications?: never; onCreated?: never }
)

const DEFAULT_TIMES = { start_time: '10:00', end_time: '12:00' }

// Tomorrow, so the form does not open already invalid in the afternoon
const defaultValues = (): FormValues => ({ date: addDays(startOfToday(), 1), ...DEFAULT_TIMES })

// The API takes full timestamps, the form collects a date and two times.
const toIso = (date: Date, time: string) => `${format(date, 'yyyy-MM-dd')} ${time}:00`

export function CalendarModal({ isOpen, onClose, editData, applications, onCreated }: Props) {
  const isEditing = !!editData
  const createMutation = useCreateExam()
  const updateMutation = useUpdateExam()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(),
  })

  useEffect(() => {
    if (!isOpen) return

    if (editData) {
      const start = parseISO(editData.start_date)
      const end = parseISO(editData.end_date)

      form.reset({ date: start, start_time: format(start, 'HH:mm'), end_time: format(end, 'HH:mm') })
    } else {
      form.reset(defaultValues())
    }
  }, [isOpen, editData, form])

  // The picked applications share one type; the queue refuses a mixed selection
  const employeeType = applications?.[0]?.employee_type ?? editData?.employee_type

  const onSubmit = (values: FormValues) => {
    const dates = {
      start_date: toIso(values.date, values.start_time),
      end_date: toIso(values.date, values.end_time),
    }

    if (isEditing && editData) {
      updateMutation.mutate({ id: editData.id, data: dates }, { onSuccess: onClose })
    } else if (applications) {
      createMutation.mutate(
        { ...dates, application_ids: applications.map((application) => application.id) },
        {
          onSuccess: () => {
            onCreated?.()
            onClose()
          },
        }
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Imtihon vaqtini o‘zgartirish' : 'Imtihon belgilash'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {applications && employeeType && (
              <div className="bg-muted/50 flex flex-wrap items-center gap-2 rounded-md p-3 text-sm">
                <Users className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{applications.length} ta xodim</span>
                <Badge variant="outline" className={EMPLOYEE_TYPE[employeeType].className}>
                  {EMPLOYEE_TYPE[employeeType].label}
                </Badge>
              </div>
            )}

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

            <p className="text-muted-foreground text-xs">
              {isEditing
                ? 'Zoom uchrashuvi vaqti ham shunga moslab o‘zgartiriladi.'
                : 'Saqlangach Zoom uchrashuvi ochiladi, sana va havola tashkilotlarning arizalarida ko‘rinadi.'}
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
