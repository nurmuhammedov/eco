import { z } from 'zod'

export const UpdateHFSchema = z.object({
  name: z.string().trim().min(1),
  upperOrganization: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  regionId: z.string().min(1),
  districtId: z.string().min(1),
  address: z.string().trim().min(1),
  location: z.string().min(1),

  hfTypeId: z.string().min(1),
  extraArea: z.string().trim().min(1),
  hazardousSubstance: z.string().trim().min(1),
  spheres: z.array(z.string()).min(1).default([]),
  managerCount: z.string().regex(/^\d+$/).min(1),
  engineerCount: z.string().regex(/^\d+$/).min(1),
  workerCount: z.string().regex(/^\d+$/).min(1),

  identificationCardPath: z.string().min(1),
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
  regulationPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  regulationExpiryDate: z
    .date()
    .optional()
    .transform((v) => (v ? v : null)),
  staffAttestationPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  staffAttestationExpiryDate: z
    .date()
    .optional()
    .transform((v) => (v ? v : null)),
  managerAttestationPath: z
    .string()
    .optional()
    .transform((v) => (v ? v : null)),
  managerAttestationExpiryDate: z
    .date()
    .optional()
    .transform((v) => (v ? v : null)),
})

export type UpdateHFDTO = z.infer<typeof UpdateHFSchema>
