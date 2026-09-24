import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { HFSphereEnum } from './register-hf.schema'

const __ReRegisterHFSchema = z.object({
  hazardousFacilityId: z.string().min(1),
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  address: z.string().trim().min(1),
  location: z.string().min(1),
  hfTypeId: z.string().min(1),
  regionId: z.string().min(1),
  districtId: z.string().min(1),
  upperOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  name: z.string().trim().min(1).max(250),
  extraArea: z.string().trim().min(1),
  hazardousSubstance: z.string().trim().min(1),
  spheres: z.array(HFSphereEnum).min(1),
  identificationCardPath: z.string().min(1),
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

export const ReRegisterHFSchema = __ReRegisterHFSchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'insurancePolicyPath', 'insurancePolicyExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'licensePath', 'licenseExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'permitPath', 'permitExpiryDate'))
