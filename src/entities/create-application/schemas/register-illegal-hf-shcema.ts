import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { HFSphere } from '@/shared/types'
import { z } from 'zod'

export const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]])

export const RegisterIllegalHFSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: 'Telefon raqam noto‘g‘ri formatda',
    }),
  legalTin: z
    .string({ required_error: 'Majburiy maydon!' })
    .regex(/^\d+$/, 'Faqat raqamlar kiritilishi kerak')
    .length(9, 'STIR 9 xonali bo‘lishi kerak'), // Aniq 9 xonalilik talabi
  name: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  location: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),

  upperOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  hfTypeId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  hfTypeName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  extraArea: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  hazardousSubstance: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  spheres: z.array(HFSphereEnum).optional(),
  identificationCardPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  receiptPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  expertOpinionPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  projectDocumentationPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  cadastralPassportPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  industrialSafetyDeclarationPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  insurancePolicyPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  licensePath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  permitPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  certificationPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  deviceTestingPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  appointmentOrderPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  ecologicalConclusionPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  fireSafetyConclusionPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  replyLetterPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  filesBuilt: z.boolean().optional(),
})
