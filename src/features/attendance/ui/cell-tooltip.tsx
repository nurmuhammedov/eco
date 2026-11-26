import { forwardRef, useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/utils'
import type { AttendanceCell, AttendanceDay, TimesheetEmployee } from '../api/attendance.api'
import {
  cellClassName,
  formatDate,
  formatHours,
  INCOMPLETE_REASON_LABELS,
  STATUS_LABELS,
} from '../model/attendance-labels'

const WEEKDAY_NAMES: Record<string, string> = {
  Du: 'Dushanba',
  Se: 'Seshanba',
  Ch: 'Chorshanba',
  Pa: 'Payshanba',
  Ju: 'Juma',
  Sh: 'Shanba',
  Ya: 'Yakshanba',
}

const WIDTH = 272
/** Room the card needs below the cell; otherwise it opens above */
const ROOM_BELOW = 210

export interface CellTooltipState {
  employee: TimesheetEmployee
  cell: AttendanceCell
  day: AttendanceDay
  rect: DOMRect
  canCorrect: boolean
}

const statusLabel = (cell: AttendanceCell) => {
  if (cell.flag === 'LATE') return 'Kech qolgan'
  if (cell.flag === 'LATE_INCOMPLETE') return 'Kech qolgan, to‘liq ishlamagan'

  return STATUS_LABELS[cell.status]
}

const Row = ({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <span className="text-neutral-500">{label}</span>
    <span className={cn('font-medium text-neutral-900 tabular-nums', className)}>{children}</span>
  </div>
)

export interface CellTooltipHandle {
  show: (state: CellTooltipState) => void
  hide: () => void
}

/**
 * The card a timesheet day opens on hover: whose day it is, its status and
 * the times behind it. One card serves every cell and keeps its own state,
 * so moving over a month of a few thousand cells does not redraw the table.
 */
export const CellTooltip = forwardRef<CellTooltipHandle>(function CellTooltip(_, ref) {
  const [state, setState] = useState<CellTooltipState | null>(null)

  useImperativeHandle(ref, () => ({ show: setState, hide: () => setState(null) }), [])

  if (!state) return null

  const { employee, cell, day, rect, canCorrect } = state
  const below = rect.bottom + ROOM_BELOW < window.innerHeight
  const left = Math.min(Math.max(rect.left + rect.width / 2 - WIDTH / 2, 8), window.innerWidth - WIDTH - 8)
  const position = below ? { top: rect.bottom + 6 } : { bottom: window.innerHeight - rect.top + 6 }
  const hasTimes = !!cell.check_in || !!cell.check_out || cell.status === 'PRESENT' || cell.status === 'INCOMPLETE'

  return createPortal(
    <div
      role="tooltip"
      style={{ position: 'fixed', left, width: WIDTH, ...position }}
      className="pointer-events-none z-[100] overflow-hidden rounded-lg border border-neutral-200 bg-white text-xs shadow-xl"
    >
      <div className="border-b border-neutral-100 bg-neutral-50 px-3 py-2">
        <p className="font-semibold text-neutral-900">
          {formatDate(day.date)}, {WEEKDAY_NAMES[day.weekday] ?? day.weekday}
        </p>
        {day.holiday && <p className="text-red-600">{day.holiday}</p>}
        <p className="truncate text-neutral-500">{employee.name}</p>
      </div>

      <div className="space-y-1.5 px-3 py-2.5">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-0.5 font-medium',
            cellClassName(cell.status, cell.flag) || 'bg-emerald-50 text-emerald-700'
          )}
        >
          {cell.code && cell.status !== 'PRESENT' && <b>{cell.code}</b>}
          {statusLabel(cell)}
        </span>

        {hasTimes && (
          <>
            <Row label="Keldi">{cell.check_in ?? '—'}</Row>
            <Row label="Ketdi">{cell.check_out ?? '—'}</Row>
          </>
        )}
        {cell.status === 'PRESENT' && (
          <Row label="Ishladi">
            {formatHours(cell.hours)} / {employee.daily_hours} soat
          </Row>
        )}
        {!!cell.late_minutes && (
          <Row label="Kechikish" className="text-red-600">
            {cell.late_minutes} daqiqa
          </Row>
        )}
        {cell.incomplete_reason && (
          <p className="text-orange-600">{INCOMPLETE_REASON_LABELS[cell.incomplete_reason]}</p>
        )}
        {cell.note && <p className="rounded bg-neutral-50 px-2 py-1 text-neutral-600 italic">{cell.note}</p>}
        {cell.corrected && <p className="font-medium text-blue-600">HR tomonidan tuzatilgan</p>}
      </div>

      {canCorrect && (
        <div className="border-t border-neutral-100 px-3 py-1.5 text-neutral-400">Tuzatish uchun bosing</div>
      )}
    </div>,
    document.body
  )
})
