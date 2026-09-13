import { ReviewParty, SignAction, WorkflowAction, WorkflowStatus } from './types'

type BadgeVariant = 'info' | 'success' | 'error' | 'warning' | 'secondary'

export const PARTY_LABELS: Record<ReviewParty, string> = {
  CUSTOMER: 'Buyurtmachi',
  FVV: 'FVV',
  SES: 'SES',
  COMMITTEE: 'Qo‘mita',
}

export const SIGN_ACTION: Record<SignAction, { label: string; variant: BadgeVariant }> = {
  APPROVED: { label: 'Tasdiqlangan', variant: 'success' },
  REJECTED: { label: 'Rad etilgan', variant: 'error' },
}

export const WORKFLOW_ACTION_LABELS: Record<WorkflowAction, string> = {
  FILL_DATA: 'Ma’lumotlarni kiritish',
  SUBMIT: 'Xulosa bilan yuborish',
  ENDORSE: 'Kelishish',
  RETURN: 'Qaytarish',
  REJECT: 'Rad etish',
  SIGN: 'E-imzo bilan tasdiqlash',
}

export const WORKFLOW_HISTORY_LABELS: Record<WorkflowAction, string> = {
  FILL_DATA: 'Ma’lumot kiritildi',
  SUBMIT: 'Keyingi pog‘onaga yuborildi',
  ENDORSE: 'Kelishildi (viza)',
  RETURN: 'Qaytarildi',
  REJECT: 'Rad etildi',
  SIGN: 'E-imzo bilan tasdiqlandi',
}

export const WORKFLOW_STATUS: Record<WorkflowStatus, { label: string; variant: BadgeVariant }> = {
  IN_PROGRESS: { label: 'Jarayonda', variant: 'info' },
  COMPLETED: { label: 'Yakunlandi', variant: 'success' },
  REJECTED: { label: 'Rad etildi', variant: 'error' },
  CANCELLED: { label: 'Bekor qilindi', variant: 'secondary' },
}
