import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { HFSphere } from '@/shared/types'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'

export const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]])

export const HFAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  location: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  hfTypeId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  upperOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  name: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  extraArea: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  hazardousSubstance: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  spheres: z.array(HFSphereEnum, { required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  identificationCardPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  receiptPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
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
})
