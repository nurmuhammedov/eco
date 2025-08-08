import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

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
  purchaseAgreementPath: z
    .string({ required_error: 'Masʼul shaxs tayinlanganligi to‘g‘risida buyruq fayli biriktirilmadi!' })
    .min(1, 'Masʼul shaxs tayinlanganligi to‘g‘risida buyruq fayli biriktirilmadi!'),
  orderSuspensionPath: z
    .string({ required_error: 'Ekspertiza loyihasi fayli biriktirilmadi!' })
    .min(1, 'Ekspertiza loyihasi fayli biriktirilmadi!'),
  laboratoryReportPath: z
    .string({ required_error: 'Montaj guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Montaj guvohnomasi fayli biriktirilmadi!'),
  additionalInfoPath: z.string().optional(),
});
