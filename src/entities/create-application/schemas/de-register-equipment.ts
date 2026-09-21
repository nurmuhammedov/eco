import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'

export const DeRegisterEquipmentSchema = z.object({
  phoneNumber: z
    .string({ required_error: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  type: z.string().min(1),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  registryNumber: z.string().min(1),
  purchaseAgreementPath: z.string().min(1),
  orderSuspensionPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  laboratoryReportPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  additionalInfoPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
})
