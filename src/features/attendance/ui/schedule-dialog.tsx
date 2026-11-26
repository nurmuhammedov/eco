import { useEffect, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import type { AttendanceStaffRow } from '../api/attendance.api'
import { useSaveSchedule } from '../model/use-attendance'

const RATES = ['1', '0.75', '0.5', '0.25']

interface FormState {
  rate: string
  daily_hours: string
  work_start: string
  work_end: string
  lunch_minutes: string
  is_tracked: boolean
  valid_from: string
  note: string
}

const firstOfMonth = () => {
  const now = new Date()

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

/**
 * An employee's rate and working hours from a given day on. Empty hours mean
 * the committee's (09:00–18:00, lunch 13:00–14:00); a part rate halves the norm.
 */
export const ScheduleDialog = ({ employee, onClose }: { employee: AttendanceStaffRow | null; onClose: () => void }) => {
  const saveMutation = useSaveSchedule()
  const [form, setForm] = useState<FormState | null>(null)

  useEffect(() => {
    if (!employee) return

    const { schedule } = employee

    setForm({
      rate: String(schedule.rate),
      daily_hours: String(schedule.daily_hours),
      work_start: schedule.is_default ? '' : schedule.work_start,
      work_end: schedule.is_default ? '' : schedule.work_end,
      lunch_minutes: schedule.is_default ? '' : String(schedule.lunch_minutes),
      is_tracked: schedule.is_tracked,
      valid_from: firstOfMonth(),
      note: schedule.note ?? '',
    })
  }, [employee])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => (current ? { ...current, [key]: value } : current))

  // A rate brings its usual norm; HR may still put another one
  const changeRate = (rate: string) =>
    setForm((current) =>
      current ? { ...current, rate, daily_hours: String(Math.max(1, Math.round(Number(rate) * 8))) } : current
    )

  const timesInvalid = !!form?.work_start && !!form?.work_end && form.work_end <= form.work_start
  const canSave = !!form && !!form.rate && !!form.valid_from && !timesInvalid

  const handleSave = () => {
    if (!employee || !form || !canSave) return

    saveMutation.mutate(
      {
        userId: employee.id,
        data: {
          rate: Number(form.rate),
          daily_hours: form.daily_hours ? Number(form.daily_hours) : null,
          work_start: form.work_start || null,
          work_end: form.work_end || null,
          lunch_minutes: form.lunch_minutes === '' ? null : Number(form.lunch_minutes),
          is_tracked: form.is_tracked,
          valid_from: form.valid_from,
          note: form.note.trim() || null,
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

        {employee && form && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-md border p-3 text-sm">
              <p className="font-medium">{employee.name}</p>
              <p className="text-muted-foreground">
                {employee.division_name}
                {employee.position ? ` · ${employee.position}` : ''}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
              <span>
                <span className="font-medium">Davomatga kiradi</span>
                <span className="text-muted-foreground block text-xs">
                  O‘chirilsa xodim tabel va hisobotlarda ko‘rsatilmaydi
                </span>
              </span>
              <Switch
                aria-label="Davomatga kiradi"
                checked={form.is_tracked}
                onChange={(event) => set('is_tracked', event.target.checked)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Stavka *</Label>
                <Select value={form.rate} onValueChange={changeRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RATES.map((rate) => (
                      <SelectItem key={rate} value={rate}>
                        {rate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-hours">Kunlik norma (soat)</Label>
                <Input
                  id="schedule-hours"
                  type="number"
                  min={1}
                  max={12}
                  value={form.daily_hours}
                  onChange={(e) => set('daily_hours', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="schedule-start">Ish boshlanishi</Label>
                <Input
                  id="schedule-start"
                  type="time"
                  value={form.work_start}
                  onChange={(e) => set('work_start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-end">Ish tugashi</Label>
                <Input
                  id="schedule-end"
                  type="time"
                  value={form.work_end}
                  onChange={(e) => set('work_end', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-lunch">Tushlik (daq.)</Label>
                <Input
                  id="schedule-lunch"
                  type="number"
                  min={0}
                  max={180}
                  value={form.lunch_minutes}
                  onChange={(e) => set('lunch_minutes', e.target.value)}
                  placeholder="60"
                />
              </div>
            </div>
            <p className={timesInvalid ? 'text-xs text-red-600' : 'text-muted-foreground text-xs'}>
              {timesInvalid
                ? 'Ish tugashi boshlanishidan keyin bo‘lishi kerak.'
                : 'Bo‘sh qolsa umumiy tartib: 09:00–18:00, tushlik 13:00–14:00.'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="schedule-from">Amal qilish sanasi *</Label>
                <Input
                  id="schedule-from"
                  type="date"
                  value={form.valid_from}
                  onChange={(e) => set('valid_from', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-note">Izoh</Label>
                <Input
                  id="schedule-note"
                  maxLength={500}
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  placeholder="Masalan: buyruq raqami"
                />
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              O‘zgarish shu sanadan boshlab amal qiladi; oldingi oylar hisobi o‘zgarmaydi.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saveMutation.isPending}>
            Bekor qilish
          </Button>
          <Button onClick={handleSave} disabled={!canSave} loading={saveMutation.isPending}>
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
