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
  // subType: z.nativeEnum(ExpertiseSubTypeEnum, {
  //   required_error: 'Ekspertiza obyekti turini tanlang',
  // }),

  objectName: z.string({ required_error: 'Obyektini kiriting!' }).min(1, 'Obyektini kiriting!'),
  regionId: z.string({ required_error: 'Viloyatni tanlang!' }),
  districtId: z.string({ required_error: 'Tumanni tanlang!' }),
  // conclusionNumber: z.string({ required_error: 'Xulosa raqami kiritilmadi!' }).min(1, 'Xulosa raqami kiritilmadi!'),
  // conclusionDate: z.date({ required_error: 'Xulosa sanasi kiritilmadi!' }),
  prefix: z
    .string({ required_error: 'Majburiy maydon!' })
    .max(500, { message: 'Obyekt nomi 500 belgidan oshmasligi kerak' })
    .optional(),
  address: z.string({ required_error: 'Manzil kiritilmadi!' }).min(1, 'Manzil kiritilmadi!'),
});
