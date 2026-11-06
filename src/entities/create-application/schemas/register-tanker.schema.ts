import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'
import { requireCitizenBirthDate } from './owner-refinement'

/**
 * A tanker (`EquipmentType.TANKER`) is told apart by what it carries. The form
 * sends this kind (`childType`) rather than a sub type id; the backend finds the
 * sub type from it.
 */
export const TANKER_CHILD_TYPES = [
  'TANKER_OIL',
  'TANKER_LPG',
  'TANKER_CHEMICAL',
  'TANKER_CRYOGENIC',
  'TANKER_RADIOACTIVE',
] as const

export type TankerChildType = (typeof TANKER_CHILD_TYPES)[number]

/** The kinds that carry their load under pressure */
const PRESSURE_TYPES: string[] = ['TANKER_LPG', 'TANKER_CHEMICAL', 'TANKER_CRYOGENIC']

/** A field only some kinds of tanker must fill in */
export type TankerConditionalField =
  | 'partialCheckDate'
  | 'fullCheckDate'
  | 'nonDestructiveCheckDate'
  | 'partialCheckPath'
  | 'fullCheckPath'
  | 'nonDestructiveCheckPath'
  | 'cleaningActPath'
  | 'testingActPath'
  | 'safetyDecreePath'
  | 'driverRadiationCertPath'

/** What a tanker of this kind must carry on top of what every tanker does; the backend checks the same */
export const tankerRequires = (childType?: string | null): Record<TankerConditionalField, boolean> => {
  const isPressure = PRESSURE_TYPES.includes(childType ?? '')
  const isOil = childType === 'TANKER_OIL'
  const isRadioactive = childType === 'TANKER_RADIOACTIVE'

  return {
    partialCheckDate: isPressure,
    fullCheckDate: isPressure,
    partialCheckPath: isPressure,
    fullCheckPath: isPressure,
    nonDestructiveCheckDate: isOil,
    nonDestructiveCheckPath: isOil,
    cleaningActPath: isOil,
    testingActPath: isRadioactive,
    safetyDecreePath: isRadioactive,
    driverRadiationCertPath: isRadioactive,
  }
}

export type TankerFilePath =
  | 'labelPath'
  | 'passportPath'
  | 'expertisePath'
  | 'fullCheckPath'
  | 'partialCheckPath'
  | 'nonDestructiveCheckPath'
  | 'testingActPath'
  | 'cleaningActPath'
  | 'fitnessConclusionPath'
  | 'equipmentCertPath'
  | 'saleContractPath'
  | 'assignmentDecreePath'
  | 'safetyDecreePath'
  | 'driverPermitPath'
  | 'driverRadiationCertPath'

export type TankerFileExpiry =
  | 'expertiseExpiryDate'
  | 'nextFullCheckDate'
  | 'nextPartialCheckDate'
  | 'nonDestructiveCheckExpiryDate'
  | 'testingActExpiryDate'
  | 'cleaningActExpiryDate'
  | 'fitnessConclusionExpiryDate'
  | 'safetyDecreeExpiryDate'
  | 'driverPermitExpiryDate'
  | 'driverRadiationCertExpiryDate'

export interface TankerFile {
  path: TankerFilePath
  label: string
  /** The date the document runs out on; once the file is attached the date is required too */
  expiry?: TankerFileExpiry
  expiryLabel?: string
  /** Every tanker carries it, whatever its kind */
  always?: boolean
  /** The photo of the plate may be a picture */
  image?: boolean
}

/** The fifteen documents of a tanker, in the order and under the names of the approved list */
export const TANKER_FILES: TankerFile[] = [
  { path: 'labelPath', label: 'Sig‘imning birkasi bilan surati', always: true, image: true },
  { path: 'passportPath', label: 'Sig‘im pasporti', always: true },
  { path: 'expertisePath', label: 'Ekspertiza xulosasi', expiry: 'expertiseExpiryDate' },
  {
    path: 'fullCheckPath',
    label: 'Sig‘imning gidravlik sinovdan o‘tkazilganligi',
    expiry: 'nextFullCheckDate',
    expiryLabel: 'Navbatdagi gidravlik sinov sanasi',
  },
  {
    path: 'partialCheckPath',
    label: 'Sig‘imning ichki ko‘rikdan o‘tkazilganligi',
    expiry: 'nextPartialCheckDate',
    expiryLabel: 'Navbatdagi ichki ko‘rik sanasi',
  },
  {
    path: 'nonDestructiveCheckPath',
    label: 'Putur yetkazmaydigan nazoratda ko‘rikdan o‘tkazilganligi',
    expiry: 'nonDestructiveCheckExpiryDate',
  },
  {
    path: 'testingActPath',
    label: 'Konteyner sinov natijalari to‘g‘risidagi dalolatnoma',
    expiry: 'testingActExpiryDate',
  },
  {
    path: 'cleaningActPath',
    label: 'Sig‘imlarni tozalanganligi to‘g‘risida dalolatnoma',
    expiry: 'cleaningActExpiryDate',
  },
  {
    path: 'fitnessConclusionPath',
    label: 'Sig‘im yaroqliligi to‘g‘risida xulosa',
    expiry: 'fitnessConclusionExpiryDate',
    always: true,
  },
  { path: 'equipmentCertPath', label: 'Sig‘im yoki konteynerlarning muvofiqlik sertifikatlari', always: true },
  { path: 'saleContractPath', label: 'Oldi-sotdi shartnomasi (egalik huquqini beruvchi hujjat)', always: true },
  { path: 'assignmentDecreePath', label: 'Mas’ul shaxs tayinlanganligi to‘g‘risida buyruq', always: true },
  {
    path: 'safetyDecreePath',
    label:
      'Xavfli yuklarni tashuvchi transport vositalarining xavfsiz ishlashi uchun mas’ul shaxs(lar) tayinlanganligi to‘g‘risidagi buyruq',
    expiry: 'safetyDecreeExpiryDate',
  },
  {
    path: 'driverPermitPath',
    label:
      'Avtotransport vositasi haydovchisining xavfli yuklarni tashishga ruxsat etilganligi to‘g‘risidagi guvohnoma',
    expiry: 'driverPermitExpiryDate',
    always: true,
  },
  {
    path: 'driverRadiationCertPath',
    label: 'Haydovchining radiatsiya xavfsizligi bo‘yicha malaka oshirganligi (sertifikat)',
    expiry: 'driverRadiationCertExpiryDate',
  },
]

/** `yyyy-MM-dd` of today, the way the dates leave the form */
const today = () => format(new Date(), 'yyyy-MM-dd')

/** The expertise conclusion is due once the service period is over */
export const isExpertiseRequired = (servicePeriod?: string | Date | null) => {
  if (!servicePeriod) return false
  const value = servicePeriod instanceof Date ? format(servicePeriod, 'yyyy-MM-dd') : servicePeriod
  return value < today()
}

/** Whether the file must be attached for a tanker of this kind and service period */
export const isTankerFileRequired = (
  file: TankerFile,
  childType?: string | null,
  servicePeriod?: string | Date | null
) => {
  if (file.always) return true
  if (file.path === 'expertisePath') return isExpertiseRequired(servicePeriod)
  return tankerRequires(childType)[file.path as TankerConditionalField] ?? false
}

const text = z.string().trim().min(1)
const optionalText = z
  .string()
  .optional()
  .nullable()
  .transform((val) => (val ? val : null))
const optionalDate = z
  .date()
  .optional()
  .nullable()
  .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null))

const filesShape = Object.fromEntries(
  TANKER_FILES.flatMap((file) => [[file.path, optionalText], ...(file.expiry ? [[file.expiry, optionalDate]] : [])])
) as Record<TankerFilePath, typeof optionalText> & Record<TankerFileExpiry, typeof optionalDate>

/**
 * The fields of `TankerDto` but the phone number. Everything a kind may skip is
 * optional here and asked for in `refineTanker`, so one schema serves every
 * kind and the errors of all fields show at once.
 */
const tankerShape = {
  hazardousFacilityId: optionalText,
  childType: text,
  regionId: text,
  districtId: text,
  address: text,
  location: text,
  numberPlate: text,
  model: text,
  factoryNumber: text,
  factory: text,
  capacity: text,
  environment: text,
  pressure: text,
  partialCheckDate: optionalDate,
  fullCheckDate: optionalDate,
  nonDestructiveCheckDate: optionalDate,
  servicePeriod: optionalDate,
  ...filesShape,
}

type TankerValues = Record<string, unknown> & { childType?: string | null; servicePeriod?: string | null }

const required = (ctx: z.RefinementCtx, path: string) =>
  ctx.addIssue({ code: z.ZodIssueCode.custom, message: FORM_ERROR_MESSAGES.required, path: [path] })

/** The requirements that depend on the kind of tanker and on its service period */
export const refineTanker = (data: TankerValues, ctx: z.RefinementCtx) => {
  const requires = tankerRequires(data.childType)

  if (!data.servicePeriod) required(ctx, 'servicePeriod')

  for (const field of ['partialCheckDate', 'fullCheckDate', 'nonDestructiveCheckDate'] as const) {
    if (requires[field] && !data[field]) required(ctx, field)
  }

  for (const file of TANKER_FILES) {
    if (data[file.path]) {
      if (file.expiry && !data[file.expiry]) required(ctx, file.expiry)
    } else if (isTankerFileRequired(file, data.childType, data.servicePeriod)) {
      required(ctx, file.path)
    }
  }
}

/**
 * The plate is sent the way the backend stores it: no spaces, upper case. It is
 * set on the whole object because a field transform stops the object, and with
 * it the kind checks, as long as the plate is empty.
 */
const withPlate = <T extends { numberPlate: string }>(data: T) => ({
  ...data,
  numberPlate: data.numberPlate.replace(/\s+/g, '').toUpperCase(),
})

const phoneNumber = z
  .string()
  .trim()
  .refine((val) => USER_PATTERNS.phone.test(val), {
    message: FORM_ERROR_MESSAGES.invalid,
  })

/** `TankerDto`: an organization or citizen files the application itself */
export const TankerAppealDtoSchema = z
  .object({ phoneNumber, ...tankerShape })
  .superRefine(refineTanker)
  .transform(withPlate)

export type CreateTankerApplicationDTO = z.infer<typeof TankerAppealDtoSchema>

/** `UnofficialTankerDto`: an inspector registers a tanker for its owner */
export const RegisterIllegalTankerBaseSchema = z.object({
  phoneNumber,
  identity: z.string().min(1),
  birthDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  ...tankerShape,
})

export const RegisterIllegalTankerSchema = RegisterIllegalTankerBaseSchema.superRefine(requireCitizenBirthDate)
  .superRefine(refineTanker)
  .transform(withPlate)

/** `UpdateTankerDto`: the same rules, the owner and the phone number stay as they are */
export const UpdateTankerSchema = RegisterIllegalTankerBaseSchema.extend({
  phoneNumber: optionalText,
  identity: optionalText,
  birthDate: optionalDate,
})
  .superRefine(refineTanker)
  .transform(withPlate)

export type RegisterIllegalTankerDTO = z.infer<typeof RegisterIllegalTankerSchema>
