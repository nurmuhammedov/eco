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

/** One exam: the commission groups queued applications into it and sets its date and place */
export interface AttestationCalendar {
  id: string
  start_date: string
  end_date: string
  employee_type: EmployeeType
  zoom_meeting_id: string | null
  zoom_join_url: string | null
  zoom_start_url?: string | null
  status: CalendarStatus
  location: string | null
  /** Formed once everyone in the exam has a result */
  protocol_number: number | null
  protocol_date: string | null
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
  location: string
}

export interface CreateExamPayload extends CalendarPayload {
  application_ids: string[]
}

/**
 * PENDING waits for the commission's decision on its request, NEW waits in the
 * queue, ASSIGNED has an exam date, SCHEDULED is being interviewed
 */
export type ApplicationStatus = 'PENDING' | 'NEW' | 'ASSIGNED' | 'SCHEDULED' | 'PASSED' | 'FAILED' | 'REJECTED'

/** One employee of a request */
export interface AttestationApplication {
  id: string
  request_id: string | null
  attestation_calendar_id: string | null
  calendar?: AttestationCalendar | null
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
  certificate_number: number | null
  certificate_issued_at: string | null
  certificate_expires_at: string | null
  created_at?: string
}

export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

/** An organization's request: employees of one direction and type, decided on as a whole */
export interface AttestationRequest {
  id: string
  organization_tin: number
  organization_name: string
  organization_director: string | null
  organization_address: string | null
  employee_type: EmployeeType
  direction: Direction
  direction_label: string
  status: RequestStatus
  status_label: string
  reject_reason: string | null
  decision_number: number | null
  decided_at: string | null
  decided_by_name: string | null
  /** Three working days after submission (resolution No. 26, item 26) */
  decision_due_at: string | null
  applications_count?: number
  applications?: AttestationApplication[]
  created_at?: string
}

/** Comes from the partner training system; direction and type are read from the certificate number */
export interface AttestationEmployee {
  pinfl: string
  full_name: string
  science_direction: string
  course_name: string
  certificate_number: string | null
  given_date: string | null
  expiration_date: string | null
  direction: Direction | null
  direction_label: string | null
  employee_type: EmployeeType | null
  has_active_application: boolean
  is_certificate_expired: boolean
}

export interface SubmitRequestPayload {
  direction: Direction
  employee_type: EmployeeType
  employees: { employee_pin: string; employee_position: string }[]
}

export interface AttestationExamSession {
  id: string
  application_id: string
  question_id: string
  question?: AttestationQuestion
  order: number
}

export type CommissionRole = 'CHAIRMAN' | 'DEPUTY' | 'MEMBER' | 'SECRETARY'

export interface AttestationCommissionMember {
  id: string
  pin: string
  full_name: string
  position: string | null
  role: CommissionRole
  role_label: string
}

/** The examiner's standing commission (resolution No. 26, items 18–19) */
export interface AttestationCommission {
  id: string
  is_central: boolean
  region_id: number | null
  name: string
  organization_name: string
  order_details: string | null
  city: string | null
  address: string | null
  phone: string | null
  minimum_members: number
  /** Why the commission may not decide or examine yet; empty when it may */
  problems: string[]
  members: AttestationCommissionMember[]
}

export interface CommissionPayload {
  name: string
  organization_name: string
  order_details: string | null
  city: string
  address: string
  phone: string | null
}

export interface CommissionMemberPayload {
  pin: string
  full_name: string
  position: string
  role: CommissionRole
}
