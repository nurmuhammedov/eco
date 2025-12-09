import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'

export const DeRegisterEquipmentSchema = z.object({
  phoneNumber: z
    .string({ required_error: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  type: z
    .string({
      required_error: 'Majburiy maydon!',
    })
    .min(1, 'Majburiy maydon!'),
  description: z.string().optional(),
  registryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  purchaseAgreementPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  orderSuspensionPath: z.string().optional(),
  laboratoryReportPath: z.string().optional(),
  additionalInfoPath: z.string().optional(),
})
