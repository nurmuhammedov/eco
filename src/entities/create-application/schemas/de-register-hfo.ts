import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const DeRegisterHF = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  description: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  sign: z.string().optional(),
  registryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  reasons: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  justifiedDocumentPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  filePath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  type: z.string().optional(),
});
