import { serviceData, servicesApiClient } from '@/shared/api/services-api-client'

/** A day of an employee as the services work it out from the FaceID events and HR's entries */
export type AttendanceStatus =
  | 'PRESENT'
  | 'BUSINESS_TRIP'
  | 'LEAVE'
  | 'ABSENT'
  | 'INCOMPLETE'
  | 'WEEKEND'
  | 'HOLIDAY'
  | 'PENDING'
  | 'NO_DATA'

/** Late with the norm worked (yellow) or not worked (red) */
export type AttendanceFlag = 'LATE' | 'LATE_INCOMPLETE'

/** What HR may set a day to */
export type CorrectionStatus = 'PRESENT' | 'ABSENT' | 'BUSINESS_TRIP' | 'LEAVE'

export type AbsenceType = 'BUSINESS_TRIP' | 'LEAVE'

export type HolidayType = 'HOLIDAY' | 'WORKDAY'

export interface AttendanceDivision {
  code: string
  name: string
  office_id: number | null
  region_id: number | null
  employees: number
}

export interface AttendanceDay {
  date: string
  day: number
  weekday: string
  is_weekend: boolean
  is_workday: boolean
  holiday: string | null
}

export interface AttendanceTotals {
  days: number
  hours: number
  lates: number
  late_minutes: number
  absent: number
  incomplete: number
  business_trip: number
  leave: number
}

export interface AttendanceCell {
  day: number
  status: AttendanceStatus
  code: string
  flag?: AttendanceFlag
  hours?: number
  late_minutes?: number
  check_in?: string
  check_out?: string
  incomplete_reason?: 'NO_EXIT' | 'NO_ENTRY'
  note?: string
  corrected?: boolean
}

export interface TimesheetEmployee {
  user_id: string
  name: string
  short_name: string
  position: string | null
  department: string | null
  rate: number
  daily_hours: number
  tracked_since: string | null
  cells: AttendanceCell[]
  totals: AttendanceTotals
}

export interface TimesheetDivision {
  code: string
  name: string | null
  employees: TimesheetEmployee[]
  totals: AttendanceTotals & { employees: number }
}

export interface Timesheet {
  year: number
  month: number
  days: AttendanceDay[]
  divisions: TimesheetDivision[]
  day_totals: { day: number; hours: number }[]
  totals: AttendanceTotals & { employees: number }
}

export interface AttendanceDiscipline {
  key: 'GOOD' | 'AVERAGE' | 'CONTROL'
  label: string
}

export interface SummaryRow {
  code: string | null
  name: string
  employees: number
  days: number
  hours: number
  lates: number
  avg_hours: number
  lates_per_employee: number
  discipline: AttendanceDiscipline | null
  absent_days: number
  incomplete_days: number
  business_trip_days: number
  leave_days: number
}

export interface AttendanceSummary {
  rows: SummaryRow[]
  total: SummaryRow
}

/** One employee's day in the daily log */
export interface AttendanceLog {
  date: string
  division_code: string
  division_name: string | null
  user_id: string
  name: string
  short_name: string
  rate: number
  check_in: string | null
  check_out: string | null
  worked_minutes: number | null
  hours: number
  late_minutes: number
  status: AttendanceStatus
  code: string
  flag: AttendanceFlag | null
  state: string
  incomplete_reason: 'NO_EXIT' | 'NO_ENTRY' | null
  note: string | null
  corrected: boolean
}

export interface AttendanceSchedule {
  id: number | null
  valid_from: string | null
  rate: number
  daily_hours: number
  work_start: string
  work_end: string
  lunch_start: string
  lunch_minutes: number
  is_tracked: boolean
  note: string | null
  is_default: boolean
}

export interface AttendanceEmployee {
  id: string
  name: string
  short_name: string
  username: string
  role: string
  position: string | null
  department_id: number | null
  department_name: string | null
  division_code: string
  division_name: string | null
}

export interface AttendanceStaffRow extends AttendanceEmployee {
  schedule: AttendanceSchedule
  last_event_at: string | null
}

export interface AttendanceEvent {
  time: string
  direction: 'in' | 'out'
  device: string | null
}

export interface EmployeeDay extends AttendanceDay {
  status: AttendanceStatus
  code: string
  flag: AttendanceFlag | null
  check_in: string | null
  check_out: string | null
  worked_minutes: number | null
  hours: number
  late_minutes: number
  counts_as_day: boolean
  incomplete_reason: 'NO_EXIT' | 'NO_ENTRY' | null
  note: string | null
  corrected: boolean
  events: AttendanceEvent[]
}

export interface AttendanceEmployeeCard {
  employee: AttendanceEmployee & { schedule: AttendanceSchedule; tracked_since: string | null }
  year: number
  month: number
  days: EmployeeDay[]
  totals: AttendanceTotals
}

export interface AttendanceAbsence {
  id: number
  user_id: string
  name: string | null
  short_name: string | null
  division_code: string | null
  division_name: string | null
  type: AbsenceType
  type_label: string
  code: string
  date_from: string
  date_to: string
  days: number
  include_weekends: boolean
  note: string | null
  document_path: string | null
  created_by_name: string | null
  created_at: string | null
}

export interface AttendanceHoliday {
  id: number
  date: string
  weekday: string
  type: HolidayType
  name: string
  created_by_name: string | null
}

export interface HolidaySuggestion {
  date: string
  type: HolidayType
  name: string
}

export interface AttendanceCorrection {
  id: number
  user_id: string
  name: string | null
  short_name: string | null
  division_code: string | null
  division_name: string | null
  date: string
  status: CorrectionStatus
  check_in: string | null
  check_out: string | null
  reason: string
  created_by_name: string | null
  updated_at: string | null
}

export interface AttendanceSettings {
  work_start: string
  work_end: string
  lunch_start: string
  lunch_minutes: number
  late_grace_minutes: number
  full_day_hours: number
}

export interface ScheduleDTO {
  rate: number
  daily_hours?: number | null
  work_start?: string | null
  work_end?: string | null
  lunch_minutes?: number | null
  is_tracked: boolean
  valid_from?: string | null
  note?: string | null
}

export interface AbsenceDTO {
  user_id: string
  type: AbsenceType
  date_from: string
  date_to: string
  include_weekends: boolean
  note?: string | null
}

export interface HolidayDTO {
  date: string
  type: HolidayType
  name: string
}

export interface CorrectionDTO {
  user_id: string
  date: string
  status: CorrectionStatus
  check_in?: string | null
  check_out?: string | null
  reason: string
}

/** The month and the filters every report reads */
export interface AttendanceFilters {
  year: number
  month: number
  division?: string
  search?: string
}

export const ATTENDANCE_ENDPOINT = '/attendance'
export const ATTENDANCE_LOGS_ENDPOINT = '/attendance/logs'
export const ATTENDANCE_EXPORT_ENDPOINT = '/attendance/export'

type Params = Record<string, string | number | boolean | null | undefined>

const get = async <T>(url: string, params?: Params) => serviceData<T>(await servicesApiClient.get<T>(url, params))

export const attendanceAPI = {
  divisions: () => get<AttendanceDivision[]>('/attendance/divisions'),
  codes: () => get<{ settings: AttendanceSettings }>('/attendance/codes'),
  timesheet: (params: Params) => get<Timesheet>('/attendance/timesheet', params),
  summary: (params: Params) => get<AttendanceSummary>('/attendance/summary', params),
  employee: (userId: string, params: Params) => get<AttendanceEmployeeCard>(`/attendance/employees/${userId}`, params),
  staff: (params: Params) => get<AttendanceStaffRow[]>('/attendance/staff', params),
  absences: (params: Params) => get<AttendanceAbsence[]>('/attendance/absences', params),
  holidays: (year: number) =>
    get<{ items: AttendanceHoliday[]; suggestions: HolidaySuggestion[] }>('/attendance/holidays', { year }),
  corrections: (params: Params) => get<AttendanceCorrection[]>('/attendance/corrections', params),

  saveSchedule: (userId: string, data: ScheduleDTO) =>
    servicesApiClient.put(`/attendance/staff/${userId}/schedule`, data),
  createAbsence: (data: AbsenceDTO) => servicesApiClient.post('/attendance/absences', data),
  updateAbsence: (id: number, data: AbsenceDTO) => servicesApiClient.put(`/attendance/absences/${id}`, data),
  deleteAbsence: (id: number) => servicesApiClient.delete(`/attendance/absences/${id}`),
  createHoliday: (data: HolidayDTO) => servicesApiClient.post('/attendance/holidays', data),
  deleteHoliday: (id: number) => servicesApiClient.delete(`/attendance/holidays/${id}`),
  saveCorrection: (data: CorrectionDTO) => servicesApiClient.put('/attendance/corrections', data),
  deleteCorrection: (id: number) => servicesApiClient.delete(`/attendance/corrections/${id}`),
}
