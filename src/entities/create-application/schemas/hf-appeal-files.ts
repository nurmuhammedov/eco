import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import type { FileDto } from '@/shared/types'

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

export const HF_APPEAL_FILE_FIELDS = [
  { name: 'identificationCardPath', label: 'Identifikatsiya varag‘i', required: true },
  { name: 'receiptPath', label: 'XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi', required: true },
  { name: 'insurancePolicyPath', label: 'Sug‘urta polisi', expiry: 'insurancePolicyExpiryDate' },
  { name: 'cadastralPassportPath', label: 'XICHO kadastr pasporti' },
  { name: 'projectDocumentationPath', label: 'Loyiha hujjatlari' },
  { name: 'licensePath', label: 'Litsenziya', expiry: 'licenseExpiryDate' },
  { name: 'expertOpinionPath', label: 'Loyiha ekspertiza xulosasi (LH)' },
  { name: 'appointmentOrderPath', label: 'Mas’ul xodim tayinlanganligi buyrug‘i' },
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
] as const satisfies readonly HfAppealFileField[]

type HfFileFieldItem = (typeof HF_APPEAL_FILE_FIELDS)[number]
type HfFilePathName = HfFileFieldItem['name']
type HfFileExpiryName = Extract<HfFileFieldItem, { expiry: string }>['expiry']

/** One category's attachments as the form holds them */
export type HfAppealFiles = { [K in HfFilePathName]?: string | null } & { [K in HfFileExpiryName]?: Date | null }

type PathSchema = z.ZodType<string | null, z.ZodTypeDef, string | null | undefined>
type ExpirySchema = z.ZodType<Date | null, z.ZodTypeDef, Date | null | undefined>

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
  const shape: Partial<Record<HfFilePathName, PathSchema> & Record<HfFileExpiryName, ExpirySchema>> = {}

  for (const item of HF_APPEAL_FILE_FIELDS) {
    shape[item.name] =
      'required' in item && requiredPaths
        ? z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required)
        : optionalPath()

    if ('expiry' in item) shape[item.expiry] = optionalDate()
  }

  // The loop above sets every key the list names
  return shape as Record<HfFilePathName, PathSchema> & Record<HfFileExpiryName, ExpirySchema>
}

const withExpiryChecks = <T extends z.ZodTypeAny>(schema: T) =>
  schema.superRefine((data: Record<string, unknown>, ctx) => {
    for (const item of HF_APPEAL_FILE_FIELDS) {
      if ('expiry' in item) checkExpiryDate(data, ctx, item.name, item.expiry)
    }
  })

/** Registration: the identification card and the fee receipt are mandatory. */
export const hfAppealFilesSchema = withExpiryChecks(z.object(buildShape(true)))

/** Editing an existing facility does not repeat those two. */
export const hfAppealFilesUpdateSchema = withExpiryChecks(z.object(buildShape(false)))

export const emptyHfAppealFiles = (): HfAppealFiles => {
  const values: HfAppealFiles = {}

  for (const item of HF_APPEAL_FILE_FIELDS) {
    values[item.name] = undefined
    if ('expiry' in item) values[item.expiry] = undefined
  }

  return values
}

/** Turns one API file set into the flat values the form fields expect. */
export const hfFilesSetToForm = (set: Record<string, FileDto> | undefined | null): HfAppealFiles => {
  const values: HfAppealFiles = {}

  for (const item of HF_APPEAL_FILE_FIELDS) {
    const entry = set?.[item.name]
    values[item.name] = entry?.path ?? undefined

    if ('expiry' in item) values[item.expiry] = entry?.expiryDate ? new Date(entry.expiryDate) : undefined
  }

  return values
}

/** Where a facility record keeps its attachments */
interface HfRecordFiles {
  categoryId?: number | string | null
  files?: Record<string, FileDto> | null
  multiCategoryFiles?: Record<string, Record<string, FileDto>> | null
}

/**
 * A single-sector record keeps its attachments in `files`; a multi-sector one
 * splits them across `multiCategoryFiles`, keyed by category.
 */
export const hfFilesToForm = (detail?: HfRecordFiles | null): Record<string, HfAppealFiles> => {
  const multi = detail?.multiCategoryFiles

  if (multi && Object.keys(multi).length > 0) {
    return Object.fromEntries(Object.entries(multi).map(([id, set]) => [String(id), hfFilesSetToForm(set)]))
  }

  return detail?.categoryId ? { [String(detail.categoryId)]: hfFilesSetToForm(detail?.files) } : {}
}
