export type CadastrePassportStatus = 'NEW' | 'IN_REVIEW' | 'IN_COMMITTEE' | 'APPROVED' | 'REJECTED'

export type ReviewParty = 'CUSTOMER' | 'FVV' | 'SES' | 'COMMITTEE'

export type SignAction = 'APPROVED' | 'REJECTED'

export type WorkflowSlot = 'FVV' | 'SES'

export type WorkflowAction = 'FILL_DATA' | 'SUBMIT' | 'ENDORSE' | 'RETURN' | 'REJECT' | 'SIGN'

export type WorkflowStatus = 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'

export type CadastreSection = Record<string, any>

export interface CadastreReview {
  party: ReviewParty
  signAction: SignAction
  conclusion: string | null
  conclusionFilePath: string | null
  reviewerProfileId: string | null
  reviewerName: string | null
  createdAt: string | null
}

export interface WorkflowInstance {
  id: string
  processType: string
  slot: WorkflowSlot
  businessId: string
  orgId: string
  orgName: string
  currentStep: number
  totalSteps: number
  currentPositionName: string | null
  allowedActions: WorkflowAction[]
  returnToStep: number | null
  status: WorkflowStatus
  assigneeProfileId: string | null
  myTurn: boolean
}

export interface WorkflowHistoryEntry {
  stepOrder: number
  action: WorkflowAction
  actorProfileId: string | null
  actorName: string | null
  positionName: string | null
  comment: string | null
  filePath: string | null
  signatureId: string | null
  createdAt: string | null
}

export interface CadastrePassport {
  id: string
  requestNumber: string
  registryNumber: string | null
  parentCadastrePassportId: string | null
  preparerProfileId: string
  preparerTin: number
  customerProfileId: string
  customerTin: number
  detailFilePath: string | null
  passportFilePath: string | null
  titlePagePath: string | null
  status: CadastrePassportStatus
  myTurn: boolean
  cadastreData: {
    preparerData: CadastreSection | null
    fvvData: CadastreSection | null
    sesData: CadastreSection | null
  } | null
  reviews: CadastreReview[]
  workflows: WorkflowInstance[]
}

export interface CadastrePassportRow {
  id: string
  requestNumber: string
  registryNumber: string | null
  parentCadastrePassportId: string | null
  preparerName: string | null
  preparerTin: number
  customerName: string | null
  customerTin: number
  status: CadastrePassportStatus
  myTurn: boolean
}
