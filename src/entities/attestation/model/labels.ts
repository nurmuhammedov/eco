import type { ApplicationStatus, CalendarStatus, Direction, EmployeeType } from './types'

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
  NEW: { label: 'Navbatda', variant: 'secondary' },
  ASSIGNED: { label: 'Imtihon belgilandi', variant: 'info' },
  SCHEDULED: { label: 'Suhbatda', variant: 'warning' },
  PASSED: { label: 'O‘tdi', variant: 'success' },
  FAILED: { label: 'O‘tmadi', variant: 'error' },
}
