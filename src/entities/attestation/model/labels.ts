import type { ApplicationStatus, CalendarStatus, CommissionRole, Direction, EmployeeType, RequestStatus } from './types'

type BadgeVariant = 'default' | 'info' | 'warning' | 'success' | 'error' | 'secondary' | 'outline'

// Pill classes follow the application status badges
export const EMPLOYEE_TYPE: Record<EmployeeType, { label: string; short: string; className: string }> = {
  LEADER: { label: 'Rahbar xodimlar', short: 'Rahbarlar', className: 'border-orange-200 bg-orange-50 text-orange-700' },
  ENGINEER: { label: 'Ishchi xodimlar', short: 'Ishchilar', className: 'border-blue-200 bg-blue-50 text-blue-700' },
}

export const EMPLOYEE_TYPE_OPTIONS = (Object.keys(EMPLOYEE_TYPE) as EmployeeType[]).map((value) => ({
  value,
  label: EMPLOYEE_TYPE[value].label,
}))

export const DIRECTION: Record<Direction, string> = {
  INDUSTRIAL_SAFETY: 'Sanoat xavfsizligi',
  RADIATION_SAFETY: 'Radiatsiya xavfsizligi',
  NUCLEAR_SAFETY: 'Yadro xavfsizligi',
}

export const DIRECTION_OPTIONS = (Object.keys(DIRECTION) as Direction[]).map((value) => ({
  value,
  label: DIRECTION[value],
}))

export const CALENDAR_STATUS: Record<CalendarStatus, { label: string; variant: BadgeVariant }> = {
  OPEN: { label: 'Rejalashtirilgan', variant: 'info' },
  IN_PROGRESS: { label: 'Jarayonda', variant: 'warning' },
  CLOSED: { label: 'Yakunlangan', variant: 'secondary' },
}

export const APPLICATION_STATUS: Record<ApplicationStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Ko‘rib chiqilmoqda', variant: 'outline' },
  NEW: { label: 'Navbatda', variant: 'secondary' },
  ASSIGNED: { label: 'Imtihon belgilandi', variant: 'info' },
  SCHEDULED: { label: 'Suhbatda', variant: 'warning' },
  PASSED: { label: 'O‘tdi', variant: 'success' },
  FAILED: { label: 'O‘tmadi', variant: 'error' },
  REJECTED: { label: 'Rad etildi', variant: 'error' },
}

export const REQUEST_STATUS: Record<RequestStatus, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Ko‘rib chiqilmoqda', variant: 'warning' },
  ACCEPTED: { label: 'Attestatsiyaga qo‘yildi', variant: 'success' },
  REJECTED: { label: 'Rad etildi', variant: 'error' },
}

export const REQUEST_STATUS_OPTIONS = (Object.keys(REQUEST_STATUS) as RequestStatus[]).map((id) => ({
  id,
  name: REQUEST_STATUS[id].label,
}))

export const COMMISSION_ROLE: Record<CommissionRole, string> = {
  CHAIRMAN: 'Komissiya raisi',
  DEPUTY: 'Rais o‘rinbosari',
  MEMBER: 'Komissiya a’zosi',
  SECRETARY: 'Komissiya kotibi',
}

export const COMMISSION_ROLE_OPTIONS = (Object.keys(COMMISSION_ROLE) as CommissionRole[]).map((value) => ({
  value,
  label: COMMISSION_ROLE[value],
}))

/** The most common reason, offered as a starting point (resolution No. 26, item 24) */
export const DEFAULT_REJECT_REASON =
  'Ariza O‘zbekiston Respublikasi Vazirlar Mahkamasining 2025-yil 21-yanvardagi “Xavfli ishlab chiqarish obyektlaridan foydalanuvchi tashkilotlarning rahbar va muhandis-texnik xodimlarini attestatsiyadan o‘tkazish tartibini takomillashtirish to‘g‘risida”gi 26-son qarori ilovasining 24-bandiga asosan arizaning ilovalari to‘liq taqdim etilmagan.'
