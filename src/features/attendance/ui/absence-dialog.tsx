import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Combobox } from '@/shared/components/ui/combobox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import type { AbsenceType, AttendanceAbsence } from '../api/attendance.api'
import { ABSENCE_TYPE_LABELS } from '../model/attendance-labels'
import { useAttendanceStaff, useSaveAbsence } from '../model/use-attendance'

interface FormState {
  user_id: string
  type: AbsenceType
  date_from: string
  date_to: string
  include_weekends: boolean
  note: string
}

const EMPTY: FormState = {
  user_id: '',
  type: 'BUSINESS_TRIP',
  date_from: '',
  date_to: '',
  include_weekends: false,
  note: '',
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
  const [form, setForm] = useState<FormState>(EMPTY)

  useEffect(() => {
    if (!isOpen) return

    setForm(
      absence
        ? {
            user_id: absence.user_id,
            type: absence.type,
            date_from: absence.date_from,
            date_to: absence.date_to,
            include_weekends: absence.include_weekends,
            note: absence.note ?? '',
          }
        : EMPTY
    )
  }, [isOpen, absence])

  const options = useMemo(
    () =>
      staff.map((employee) => ({
        id: employee.id,
        name: `${employee.name} — ${employee.division_name ?? ''}`,
      })),
    [staff]
  )

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const rangeInvalid = !!form.date_from && !!form.date_to && form.date_to < form.date_from
  const canSave = !!form.user_id && !!form.date_from && !!form.date_to && !rangeInvalid

  const handleSave = () => {
    if (!canSave) return

    saveMutation.mutate({ id: absence?.id, data: { ...form, note: form.note.trim() || null } }, { onSuccess: onClose })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{absence ? 'Sababli yo‘qlikni tahrirlash' : 'Sababli yo‘qlik qo‘shish'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Xodim *</Label>
            <Combobox
              options={options}
              value={form.user_id}
              onChange={(value) => set('user_id', String(value))}
              placeholder={isLoading ? 'Yuklanmoqda...' : 'Xodimni tanlang'}
              searchPlaceholder="F.I.Sh."
              disabled={isLoading || !!absence}
            />
          </div>

          <div className="space-y-2">
            <Label>Turi *</Label>
            <Select value={form.type} onValueChange={(value) => set('type', value as AbsenceType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ABSENCE_TYPE_LABELS) as AbsenceType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ABSENCE_TYPE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="absence-from">Boshlanishi *</Label>
              <Input
                id="absence-from"
                type="date"
                value={form.date_from}
                onChange={(e) => set('date_from', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="absence-to">Tugashi *</Label>
              <Input
                id="absence-to"
                type="date"
                value={form.date_to}
                onChange={(e) => set('date_to', e.target.value)}
              />
            </div>
          </div>
          {rangeInvalid && <p className="text-xs text-red-600">Tugash sanasi boshlanishidan oldin bo‘lmasin.</p>}

          <div className="flex items-center gap-2">
            <Checkbox
              id="absence-weekends"
              checked={form.include_weekends}
              onCheckedChange={(checked) => set('include_weekends', checked === true)}
            />
            <Label htmlFor="absence-weekends" className="font-normal">
              Oraliqdagi shanba va yakshanba ham hisoblansin
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="absence-note">Izoh</Label>
            <Textarea
              id="absence-note"
              rows={2}
              maxLength={500}
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
              placeholder="Masalan: buyruq raqami va sanasi"
            />
          </div>
        </div>

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
