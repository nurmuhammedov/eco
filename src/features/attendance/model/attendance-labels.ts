import type {
  AbsenceType,
  AttendanceDiscipline,
  AttendanceFlag,
  AttendanceStatus,
  CorrectionStatus,
} from '../api/attendance.api'

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: 'Ishda',
  BUSINESS_TRIP: 'Xizmat safari',
  LEAVE: 'O‘qish / ta’til',
  ABSENT: 'Sababsiz kelmagan',
  INCOMPLETE: 'Kirish yoki chiqish qayd etilmagan',
  WEEKEND: 'Dam olish kuni',
  HOLIDAY: 'Bayram',
  PENDING: 'Kun tugamagan',
  NO_DATA: 'FaceID orqali hali qayd etilmagan',
}

/** The statuses the daily log can be filtered by */
export const LOG_STATUSES: AttendanceStatus[] = ['PRESENT', 'BUSINESS_TRIP', 'LEAVE', 'ABSENT', 'INCOMPLETE']

export const CORRECTION_STATUS_LABELS: Record<CorrectionStatus, string> = {
  PRESENT: 'Ishda bo‘lgan',
  ABSENT: 'Sababsiz kelmagan',
  BUSINESS_TRIP: 'Xizmat safari (X)',
  LEAVE: 'O‘qish / ta’til (O‘)',
}

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  BUSINESS_TRIP: 'Xizmat safari (X)',
  LEAVE: 'O‘qish / ta’til (O‘)',
}

export const INCOMPLETE_REASON_LABELS = {
  NO_EXIT: 'Chiqish qayd etilmagan',
  NO_ENTRY: 'Kirish qayd etilmagan',
} as const

/** Colours of a timesheet cell: the template's yellow and red for lateness, a tint for the codes */
export const cellClassName = (status: AttendanceStatus, flag?: AttendanceFlag | null): string => {
  if (flag === 'LATE') return 'bg-amber-200 text-amber-950'
  if (flag === 'LATE_INCOMPLETE') return 'bg-red-200 text-red-900'

  switch (status) {
    case 'BUSINESS_TRIP':
      return 'bg-sky-50 text-sky-700 font-semibold'
    case 'LEAVE':
      return 'bg-violet-50 text-violet-700 font-semibold'
    case 'ABSENT':
      return 'text-red-600 font-bold'
    case 'INCOMPLETE':
      return 'bg-orange-100 text-orange-700 font-bold'
    default:
      return ''
  }
}

export const DISCIPLINE_CLASS: Record<AttendanceDiscipline['key'], string> = {
  GOOD: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  AVERAGE: 'border-amber-200 bg-amber-50 text-amber-700',
  CONTROL: 'border-red-200 bg-red-50 text-red-700',
}

/** "8", "7.5" */
export const formatHours = (hours: number | null | undefined): string => {
  if (hours === null || hours === undefined) return '—'

  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
}

/** "2026-11-04" → "04.11.2026" */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '—'

  const [year, month, day] = date.slice(0, 10).split('-')

  return `${day}.${month}.${year}`
}

/** The first and the last day of a month, as the API reads them */
export const monthRange = (year: number, month: number) => {
  const last = new Date(year, month, 0).getDate()
  const pad = (value: number) => String(value).padStart(2, '0')

  return { from: `${year}-${pad(month)}-01`, to: `${year}-${pad(month)}-${pad(last)}` }
}

/** Today in the committee's time zone, Y-m-d */
export const todayIso = (): string => {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** What a day says on hover: times, hours, lateness and HR's note */
export const describeDay = (
  date: string,
  weekday: string,
  day: {
    status: AttendanceStatus
    check_in?: string | null
    check_out?: string | null
    hours?: number
    late_minutes?: number
    note?: string | null
    corrected?: boolean
    incomplete_reason?: 'NO_EXIT' | 'NO_ENTRY' | null
  },
  holiday?: string | null
): string => {
  const lines = [`${formatDate(date)} (${weekday})${holiday ? ` — ${holiday}` : ''}`, STATUS_LABELS[day.status]]

  if (day.check_in || day.check_out) lines.push(`Keldi: ${day.check_in ?? '—'}, ketdi: ${day.check_out ?? '—'}`)
  if (day.status === 'PRESENT' && day.hours !== undefined) lines.push(`Ishladi: ${formatHours(day.hours)} soat`)
  if (day.late_minutes) lines.push(`Kechikish: ${day.late_minutes} daqiqa`)
  if (day.incomplete_reason) lines.push(INCOMPLETE_REASON_LABELS[day.incomplete_reason])
  if (day.note) lines.push(`Izoh: ${day.note}`)
  if (day.corrected) lines.push('HR tomonidan tuzatilgan')

  return lines.join('\n')
}
