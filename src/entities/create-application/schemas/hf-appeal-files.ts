import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'

/**
 * One set of attachments per selected category. The appeal used to carry these
 * at the top level; the server now takes a map keyed by category id, so the set
 * is described once and reused for however many categories are chosen.
 *
 * Order follows the form as it stood, so nothing moves on screen.
 */
export interface HfAppealFileField {
  name: string
  label: string
  required?: boolean
  /** Paired expiry, enabled only once a file is attached. */
  expiry?: string
}

export const HF_APPEAL_FILE_FIELDS: HfAppealFileField[] = [
  { name: 'identificationCardPath', label: 'Identifikatsiya varag‘i', required: true },
  { name: 'receiptPath', label: 'XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi', required: true },
  { name: 'insurancePolicyPath', label: 'Sug‘urta polisi', expiry: 'insurancePolicyExpiryDate' },
  { name: 'cadastralPassportPath', label: 'XICHO kadastr pasporti' },
  { name: 'projectDocumentationPath', label: 'Loyiha hujjatlari' },
  { name: 'licensePath', label: 'Litsenziya', expiry: 'licenseExpiryDate' },
  { name: 'expertOpinionPath', label: 'Loyiha ekspertiza xulosasi (LH)' },
  { name: 'appointmentOrderPath', label: 'Ma’sul xodim tayinlanganligi buyrug‘i' },
  { name: 'permitPath', label: 'Ruxsatnoma', expiry: 'permitExpiryDate' },
  { name: 'industrialSafetyDeclarationPath', label: 'Sanoat xavfsizligi deklaratsiyasi' },
  { name: 'regulationPath', label: 'Ishlab chiqarish nazorati nizomi', expiry: 'regulationExpiryDate' },
  {
    name: 'staffAttestationPath',
    label: 'Xodimlarining sanoat xavfsizligi bo‘yicha attestatsiyadan o‘tganligi',
    expiry: 'staffAttestationExpiryDate',
  },
  {
    name: 'managerAttestationPath',
    label: 'Rahbar va muhandis-texnik xodimlarni sanoat xavfsizligi bo‘yicha attestatsiyadan o‘tkazilganligi',
    expiry: 'managerAttestationExpiryDate',
  },
]

const optionalPath = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((value) => (value ? value : null))

const optionalDate = () =>
  z
    .date()
    .optional()
    .nullable()
    .transform((value) => (value ? value : null))

const buildShape = (requiredPaths: boolean) => {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const item of HF_APPEAL_FILE_FIELDS) {
    shape[item.name] =
      item.required && requiredPaths
        ? z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required)
        : optionalPath()

    if (item.expiry) shape[item.expiry] = optionalDate()
  }

  return shape
}

const withExpiryChecks = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: any, ctx: z.RefinementCtx) => {
    for (const item of HF_APPEAL_FILE_FIELDS) {
      if (item.expiry) checkExpiryDate(data, ctx, item.name, item.expiry)
    }
  })

/** Registration: the identification card and the fee receipt are mandatory. */
export const hfAppealFilesSchema = withExpiryChecks(z.object(buildShape(true)))

/** Editing an existing facility does not repeat those two. */
export const hfAppealFilesUpdateSchema = withExpiryChecks(z.object(buildShape(false)))

export const emptyHfAppealFiles = () =>
  Object.fromEntries(
    HF_APPEAL_FILE_FIELDS.flatMap((item) =>
      item.expiry
        ? [
            [item.name, undefined],
            [item.expiry, undefined],
          ]
        : [[item.name, undefined]]
    )
  )

/** Turns one API file set into the flat values the form fields expect. */
export const hfFilesSetToForm = (set: Record<string, any> | undefined | null) => {
  const values: Record<string, unknown> = {}

  for (const item of HF_APPEAL_FILE_FIELDS) {
    const entry = set?.[item.name]
    values[item.name] = entry?.path ?? undefined

    if (item.expiry) values[item.expiry] = entry?.expiryDate ? new Date(entry.expiryDate) : undefined
  }

  return values
}

/**
 * A single-sector record keeps its attachments in `files`; a multi-sector one
 * splits them across `multiCategoryFiles`, keyed by category.
 */
export const hfFilesToForm = (detail: any): Record<string, unknown> => {
  const multi = detail?.multiCategoryFiles

  if (multi && Object.keys(multi).length > 0) {
    return Object.fromEntries(Object.entries(multi).map(([id, set]) => [String(id), hfFilesSetToForm(set as any)]))
  }

  return detail?.categoryId ? { [String(detail.categoryId)]: hfFilesSetToForm(detail?.files) } : {}
}
