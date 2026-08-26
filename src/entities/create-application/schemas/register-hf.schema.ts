import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { HFSphere } from '@/shared/types'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'
import { HfHazardousSign, HfLegalType } from '@/shared/constants/hf-attributes'

export const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]])

const __HFAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  location: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  categoryId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  hfTypeId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  upperOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  name: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .min(1, 'Majburiy maydon!')
    .max(250, 'Kiritilgan maʼlumot yaroqli emas'),
  extraArea: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  hazardousSubstance: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  hazardousSign: z.nativeEnum(HfHazardousSign, { required_error: FORM_ERROR_MESSAGES.required }),
  legalType: z.nativeEnum(HfLegalType, { required_error: FORM_ERROR_MESSAGES.required }),
  cadastreNumber: z
    .string({ required_error: FORM_ERROR_MESSAGES.required })
    .trim()
    .min(1, FORM_ERROR_MESSAGES.required)
    .max(50, FORM_ERROR_MESSAGES.invalid),
  // LocalDate on the server: an ISO datetime would not parse.
  startedDate: z.date({ required_error: FORM_ERROR_MESSAGES.required }).transform((date) => format(date, 'yyyy-MM-dd')),
  spheres: z.array(HFSphereEnum, { required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  identificationCardPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  receiptPath: z.string({ required_error: FORM_ERROR_MESSAGES.required }).min(1, FORM_ERROR_MESSAGES.required),
  insurancePolicyPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  insurancePolicyExpiryDate: z.date().optional(),
  cadastralPassportPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  projectDocumentationPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  licensePath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  licenseExpiryDate: z.date().optional(),
  expertOpinionPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  appointmentOrderPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  permitPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  permitExpiryDate: z.date().optional(),
  industrialSafetyDeclarationPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  regulationPath: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  regulationExpiryDate: z
    .date()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  staffAttestationPath: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  staffAttestationExpiryDate: z
    .date()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  managerAttestationPath: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  managerAttestationExpiryDate: z
    .date()
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
})

export const HFAppealDtoSchema = __HFAppealDtoSchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'insurancePolicyPath', 'insurancePolicyExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'licensePath', 'licenseExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'permitPath', 'permitExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'regulationPath', 'regulationExpiryDate'))
  .superRefine((data: any, ctx: any) =>
    checkExpiryDate(data, ctx, 'staffAttestationPath', 'staffAttestationExpiryDate')
  )
  .superRefine((data: any, ctx: any) =>
    checkExpiryDate(data, ctx, 'managerAttestationPath', 'managerAttestationExpiryDate')
  )
