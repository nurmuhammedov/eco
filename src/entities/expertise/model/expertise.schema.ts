import { z } from 'zod';
import { ExpertiseTypeEnum } from './constants';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';

export const addExpertiseSchema = z.object({
  customerTin: z
    .string({
      required_error: 'STIR  kiritilmadi!',
    })
    .length(9, 'STIR 9 ta raqamdan iborat bo‘lishi kerak'),
  customerPhoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hfId: z.string().optional().nullable(),

  type: z.nativeEnum(ExpertiseTypeEnum, {
    required_error: 'Ekspertiza turini tanlang',
  }),
  objectName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  regionId: z.string({ required_error: 'Viloyatni tanlang!' }),
  districtId: z.string({ required_error: 'Tumanni tanlang!' }),
  expertiseName: z
    .string({ required_error: 'Majburiy maydon!' })
    .min(1, 'Majburiy maydon!')
    .max(500, { message: 'Obyekt nomi 500 belgidan oshmasligi kerak' }),
  address: z.string({ required_error: 'Manzil kiritilmadi!' }).min(1, 'Manzil kiritilmadi!'),
});
