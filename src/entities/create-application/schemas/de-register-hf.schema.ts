import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'

export const DeRegisterHFSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  registryNumber: z.string().min(1),
  reasons: z.string().min(1),
  justifiedDocumentPath: z.string().min(1),
  handoverActPath: z.string().min(1),
})
