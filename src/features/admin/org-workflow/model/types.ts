export const PROCESS_TYPE = 'CADASTRE_PASSPORT_REVIEW'

export const SLOTS = ['FVV', 'SES'] as const

export const WORKFLOW_ACTIONS = ['FILL_DATA', 'SUBMIT', 'ENDORSE', 'RETURN', 'REJECT', 'SIGN'] as const

export type WorkflowAction = (typeof WORKFLOW_ACTIONS)[number]

export const ACTION_LABELS: Record<WorkflowAction, string> = {
  FILL_DATA: 'Ma’lumot kiritish',
  SUBMIT: 'Xulosa bilan yuborish',
  ENDORSE: 'Kelishish',
  RETURN: 'Qaytarish',
  REJECT: 'Rad etish',
  SIGN: 'E-imzo',
}

export interface PartnerOrg {
  id: string
  profileId: string
  tin: number
  name: string
  code: string
  isActive: boolean
}

export interface OrgPosition {
  id: string
  orgId: string
  code: string
  name: string
}

export interface OrgEmployee {
  id: string
  orgId: string
  orgName: string
  positionId: string
  positionName: string
  profileId: string
  fullName: string
  pin: number
  isActive: boolean
}

export interface WorkflowStep {
  stepOrder: number
  positionId: string
  positionName: string | null
  allowedActions: WorkflowAction[]
  returnToStep: number | null
}

export interface WorkflowDefinition {
  id: string
  processType: string
  orgId: string
  version: number
  isActive: boolean
  steps: WorkflowStep[]
}

export interface ProcessParticipant {
  id: string
  processType: string
  slot: string
  orgId: string
  orgName: string
  isActive: boolean
}
