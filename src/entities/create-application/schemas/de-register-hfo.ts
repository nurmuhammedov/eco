import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const DeRegisterHFO = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  description: z.string({ required_error: 'Talab qilinadigan maydon!' }).min(1, 'Talab qilinadigan maydon!'),
  sign: z.string().optional(),
  registryNumber: z.string({ required_error: 'Zavod raqami kiritilmadi!' }).min(1, 'Zavod raqami kiritilmadi!'),
  reasons: z.string({ required_error: 'Talab qilinadigan maydon!' }).min(1, 'Talab qilinadigan maydon!'),
  justifiedDocumentPath: z.string({ required_error: 'Talab qilinadigan maydon!' }).min(1, 'Talab qilinadigan maydon!'),
  filePath: z.string().optional(),
  type: z.string().optional(),
});
