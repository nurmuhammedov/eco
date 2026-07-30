export interface AttestationDirection {
  id: string
  name: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface AttestationQuestion {
  id: string
  attestation_direction_id: string
  employee_type: 'LEADER' | 'ENGINEER'
  question_text: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface CreateDirectionPayload {
  name: string
  is_active: boolean
}

export interface UpdateDirectionPayload {
  name: string
  is_active: boolean
}

export interface CreateQuestionPayload {
  attestation_direction_id: string
  employee_type: 'LEADER' | 'ENGINEER'
  question_text: string
  is_active: boolean
}

export interface UpdateQuestionPayload {
  attestation_direction_id?: string
  employee_type?: 'LEADER' | 'ENGINEER'
  question_text: string
  is_active: boolean
}
