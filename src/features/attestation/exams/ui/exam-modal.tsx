import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, isToday, parseISO } from 'date-fns'
import { Info, Loader2, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DatePicker from '@/shared/components/ui/datepicker'
import { EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import { earliestExamDate, isAllowedExamDate, NOTICE_WORKING_DAYS } from '@/entities/attestation/lib/attempts'
import type { AttestationApplication, AttestationCalendar } from '@/entities/attestation/model/types'
import { useCommission } from '@/features/attestation/commission/model/use-commission'
import { useCreateExam, useUpdateExam } from '../model/use-exams'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

const schema = z
  .object({
    date: z.date(),
    start_time: z.string().min(1),
    end_time: z.string().min(1),
    location: z.string().trim().min(1).max(500),
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

// The first day the notice period allows (item 27), so the form opens valid
const defaultValues = (location = ''): FormValues => ({ date: earliestExamDate(), ...DEFAULT_TIMES, location })

// The API takes full timestamps, the form collects a date and two times.
const toIso = (date: Date, time: string) => `${format(date, 'yyyy-MM-dd')} ${time}:00`

export function ExamModal({ isOpen, onClose, editData, applications, onCreated }: Props) {
  const isEditing = !!editData
  const createMutation = useCreateExam()
  const updateMutation = useUpdateExam()
  const isPending = createMutation.isPending || updateMutation.isPending

  // The commission's usual place is offered for a new exam
  const { data: commission } = useCommission(isOpen)
  const defaultLocation = commission?.address ?? ''

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(),
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
        location: editData.location ?? defaultLocation,
      })
    } else {
      form.reset(defaultValues(defaultLocation))
    }
  }, [isOpen, editData, form, defaultLocation])

  // An exam set before the notice rule may keep its day, it only cannot be moved closer
  const currentDate = editData ? parseISO(editData.start_date) : null
  const earliest = earliestExamDate()

  // The picked applications share one type; the queue refuses a mixed selection
  const employeeType = applications?.[0]?.employee_type ?? editData?.employee_type

  const onSubmit = (values: FormValues) => {
    if (!isAllowedExamDate(values.date, new Date(), currentDate)) {
      form.setError('date', {
        message: `Kamida ${NOTICE_WORKING_DAYS} ish kuni keyingi sana tanlanadi: ${format(earliest, 'dd.MM.yyyy')} yoki undan keyin`,
      })
      return
    }

    const dates = {
      start_date: toIso(values.date, values.start_time),
      end_date: toIso(values.date, values.end_time),
      location: values.location,
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
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    disableStrategy="custom"
                    customDisabledFn={(date) => !isAllowedExamDate(date, new Date(), currentDate)}
                  />
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>O‘tkaziladigan joy</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masalan: Qo‘mita binosi (Shayxontohur tumani, M-14, 27-uy)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 p-2.5 text-xs text-blue-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                26-son Nizomning 27-bandiga ko‘ra tashkilot attestatsiya joyi va vaqti haqida kamida{' '}
                {NOTICE_WORKING_DAYS} ish kuni oldin yozma xabardor qilinadi, shuning uchun imtihonning eng erta sanasi
                — {format(earliest, 'dd.MM.yyyy')}.
              </p>
            </div>

            <p className="text-muted-foreground text-xs">
              {isEditing
                ? 'Zoom uchrashuvi vaqti ham shunga moslab o‘zgartiriladi.'
                : 'Saqlangach Zoom uchrashuvi ochiladi. Sana, joy va havola tashkilotlarning arizalarida ko‘rinadi, har bir tashkilotga xat imtihon sahifasidan olinadi.'}
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
