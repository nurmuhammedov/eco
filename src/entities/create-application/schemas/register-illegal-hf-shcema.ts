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

  upperOrganization: z.string().optional(),
  hfTypeId: z.string().optional(),
  hfTypeName: z.string().optional(),
  extraArea: z.string().optional(),
  hazardousSubstance: z.string().optional(),
  spheres: z.array(HFSphereEnum).optional(),
  identificationCardPath: z.string().optional(),
  receiptPath: z.string().optional(),
  expertOpinionPath: z.string().optional(),
  projectDocumentationPath: z.string().optional(),
  cadastralPassportPath: z.string().optional(),
  industrialSafetyDeclarationPath: z.string().optional(),
  insurancePolicyPath: z.string().optional(),
  licensePath: z.string().optional(),
  permitPath: z.string().optional(),
  certificationPath: z.string().optional(),
  deviceTestingPath: z.string().optional(),
  appointmentOrderPath: z.string().optional(),
  ecologicalConclusionPath: z.string().optional(),
  fireSafetyConclusionPath: z.string().optional(),
  replyLetterPath: z.string().optional(),
  filesBuilt: z.boolean().optional(),
})
