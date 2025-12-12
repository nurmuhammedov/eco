import { z } from 'zod'
import { HFSphereEnum } from '@/entities/create-application'

export const UpdateHFSchema = z.object({
  name: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  upperOrganization: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  location: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),

  hfTypeId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  extraArea: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  hazardousSubstance: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  spheres: z.array(HFSphereEnum, { required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),

  identificationCardPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  receiptPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),

  insurancePolicyPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  insurancePolicyExpiryDate: z
    .date()
    .optional()
    .transform((v) => (v ? v : null)),

  cadastralPassportPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  projectDocumentationPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),

  licensePath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  licenseExpiryDate: z
    .date()
    .optional()
    .transform((v) => (v ? v : null)),

  expertOpinionPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  appointmentOrderPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),

  permitPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  permitExpiryDate: z
    .date()
    .optional()
    .transform((v) => (v ? v : null)),

  industrialSafetyDeclarationPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
})

export type UpdateHFDTO = z.infer<typeof UpdateHFSchema>
