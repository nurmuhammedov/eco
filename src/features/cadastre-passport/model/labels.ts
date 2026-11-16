import { ReviewParty, SignAction, WorkflowAction, WorkflowStatus } from './types'

type BadgeVariant = 'default' | 'info' | 'success' | 'error' | 'warning' | 'secondary'

/**
 * The reviewers by their full names, as the title page signs them (asked 2026-11-16):
 * «FVV», «SES» and a bare «Qo‘mita» left readers unsure who had signed.
 */
export const PARTY_LABELS: Record<ReviewParty, string> = {
  CUSTOMER: 'Buyurtmachi',
  FVV: 'O‘zbekiston Respublikasi Favqulodda vaziyatlar vazirligi',
  SES: 'O‘zbekiston Respublikasi Sog‘liqni saqlash vazirligi huzuridagi Sanitariya – epidemiologik osoyishtalik va jamoat salomatligi qo‘mitasi',
  COMMITTEE: 'O‘zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi',
}

export const SIGN_ACTION: Record<SignAction, { label: string; variant: BadgeVariant }> = {
  APPROVED: { label: 'Tasdiqlangan', variant: 'success' },
  REJECTED: { label: 'Rad etilgan', variant: 'error' },
}

/** The FVV/SES executor's two documents on SUBMIT: the reference files and the optional letter. */
export const REFERENCE_FILES_LABEL = 'Ma’lumotnoma (ilova)'
export const OBSERVATION_LETTER_LABEL = 'Kuzatuv xati'

/** One link per file; a number only when there is more than one. */
export const fileTitle = (label: string, index: number, count: number) => (count > 1 ? `${label} ${index + 1}` : label)

/** What an executor writes nearly every time; the box stays editable. */
export const DEFAULT_POSITIVE_CONCLUSION = 'Obyektga ijobiy xulosa berilgan'

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
