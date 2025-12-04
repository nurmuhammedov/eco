import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'

export const DeRegisterEquipment = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  type: z.string({
    required_error: 'Majburiy maydon',
  }),
  description: z.string().optional(),
  registryNumber: z.string({ required_error: 'Zavod raqami kiritilmadi!' }).min(1, 'Zavod raqami kiritilmadi!'),
  purchaseAgreementPath: z.string().optional(),
  orderSuspensionPath: z.string().optional(),
  laboratoryReportPath: z.string().optional(),
  additionalInfoPath: z.string().optional(),
})
