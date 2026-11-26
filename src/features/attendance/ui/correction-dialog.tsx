import { useEffect, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
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

/** A day without an exit is most often confirmed as worked */
const initialStatus = (status: AttendanceStatus): CorrectionStatus =>
  status === 'ABSENT' || status === 'BUSINESS_TRIP' || status === 'LEAVE' ? status : 'PRESENT'

/**
 * HR's decision on one day: confirm a day without an exit with the time the
 * employee left, or set it as absent, a business trip or a leave.
 */
export const CorrectionDialog = ({ target, onClose }: { target: CorrectionTarget | null; onClose: () => void }) => {
  const saveMutation = useSaveCorrection()
  const [status, setStatus] = useState<CorrectionStatus>('PRESENT')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!target) return

    setStatus(initialStatus(target.status))
    setCheckIn(target.checkIn ?? '')
    setCheckOut(target.checkOut ?? '')
    setReason('')
  }, [target])

  const isPresent = status === 'PRESENT'
  const timesInvalid = isPresent && !!checkIn && !!checkOut && checkOut <= checkIn
  const canSave = !!reason.trim() && !timesInvalid

  const handleSave = () => {
    if (!target || !canSave) return

    saveMutation.mutate(
      {
        user_id: target.userId,
        date: target.date,
        status,
        check_in: isPresent ? checkIn || null : null,
        check_out: isPresent ? checkOut || null : null,
        reason: reason.trim(),
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
          <div className="space-y-4">
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

            <div className="space-y-2">
              <Label>Holati *</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as CorrectionStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CORRECTION_STATUS_LABELS) as CorrectionStatus[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {CORRECTION_STATUS_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isPresent && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="correction-in">Kelgan vaqti</Label>
                    <Input
                      id="correction-in"
                      type="time"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correction-out">Ketgan vaqti</Label>
                    <Input
                      id="correction-out"
                      type="time"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>
                <p className={timesInvalid ? 'text-xs text-red-600' : 'text-muted-foreground text-xs'}>
                  {timesInvalid
                    ? 'Ketgan vaqti kelgan vaqtidan keyin bo‘lishi kerak.'
                    : 'Bo‘sh qolsa FaceID vaqtlari olinadi; ular ham bo‘lmasa to‘liq ish kuni hisoblanadi.'}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="correction-reason">Sababi *</Label>
              <Textarea
                id="correction-reason"
                rows={3}
                maxLength={500}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Masalan: chiqishda qurilma ishlamagan, rahbar tasdiqladi"
              />
            </div>
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
