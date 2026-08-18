export type EmployeeType = 'LEADER' | 'ENGINEER'

/** Fixed by regulation, mirrors the backend enum */
export type Direction = 'INDUSTRIAL_SAFETY' | 'RADIATION_SAFETY' | 'NUCLEAR_SAFETY'

export type CalendarStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED'

export interface AttestationQuestion {
  id: string
  direction: Direction
  direction_label: string
  employee_type: EmployeeType
  question_text: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface QuestionPayload {
  direction: Direction
  employee_type: EmployeeType
  question_text: string
  is_active: boolean
}

export interface AttestationCalendar {
  id: string
  start_date: string
  end_date: string
  employee_type: EmployeeType
  capacity: number
  remaining_capacity: number
  zoom_meeting_id: string | null
  zoom_join_url: string | null
  zoom_start_url?: string | null
  status: CalendarStatus
  has_video: boolean
  video_name: string | null
  video_url: string | null
  applications_count?: number
  created_by_pin?: number
  created_at?: string
  updated_at?: string
}

export interface CalendarPayload {
  start_date: string
  end_date: string
  employee_type: EmployeeType
  capacity: number
}

export type ApplicationStatus = 'NEW' | 'SCHEDULED' | 'PASSED' | 'FAILED'

export interface AttestationApplication {
  id: string
  attestation_calendar_id: string
  calendar?: AttestationCalendar
  organization_tin: number
  organization_name: string
  employee_pin: number
  employee_name: string
  employee_position: string | null
  employee_type: EmployeeType
  direction: Direction
  direction_label: string
  status: ApplicationStatus
  status_label: string
  result: 'PASSED' | 'FAILED' | null
  has_exam: boolean
  examined_at: string | null
  examined_by_name: string | null
  created_at?: string
}

/** Comes from the partner training system */
export interface AttestationEmployee {
  pinfl: string
  full_name: string
  science_direction: string
  course_name: string
  certificate_number: string | null
  given_date: string | null
  expiration_date: string | null
  has_active_application: boolean
  is_certificate_expired: boolean
}

export interface ApplicationEmployeePayload {
  employee_pin: string
  employee_name: string
  employee_position: string
  employee_type: EmployeeType
  direction: Direction
}

export interface CreateApplicationPayload {
  attestation_calendar_id: string
  employees: ApplicationEmployeePayload[]
}

export interface AttestationExamSession {
  id: string
  application_id: string
  question_id: string
  question?: AttestationQuestion
  order: number
}
