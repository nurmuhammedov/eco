// src/entities/create-application/schemas/register-irs.schema.ts
import { stateService } from '@/entities/create-application/types/enums';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format, parseISO } from 'date-fns'; // parseISO ni import qiling
import { z } from 'zod';

export const XrayAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  licenseNumber: z.string().optional(), // Ixtiyoriy
  model: z.string().optional(), // Ixtiyoriy
  licenseRegistryNumber: z
    .string({ required_error: 'Ruxsatnoma raqami kiritilmadi!' })
    .min(1, 'Ruxsatnoma raqami kiritilmadi!'),
  licenseDate: z // String qabul qilinadi, keyin Date ga o'giriladi
    .string({ required_error: 'Ruxsatnoma berilgan sana kiritilmadi!' })
    .min(1, 'Ruxsatnoma berilgan sana kiritilmadi!')
    .refine((val) => !isNaN(parseISO(val).valueOf()), { message: 'Sana noto‘g‘ri formatda' })
    .transform((val) => format(parseISO(val), 'yyyy-MM-dd')),
  licenseExpiryDate: z // String qabul qilinadi, keyin Date ga o'giriladi
    .string({ required_error: 'Ruxsatnomani amal qilish muddati kiritilmadi!' })
    .min(1, 'Ruxsatnomani amal qilish muddati kiritilmadi!')
    .refine((val) => !isNaN(parseISO(val).valueOf()), { message: 'Sana noto‘g‘ri formatda' })
    .transform((val) => format(parseISO(val), 'yyyy-MM-dd')),
  serialNumber: z.string({ required_error: 'Seriya raqami kiritilmadi!' }).min(1, 'Seriya raqami kiritilmadi!'),
  manufacturedYear: z
    .string({ required_error: 'Ishlab chiqarilgan yil kiritilmadi!' })
    .min(4, 'Ishlab chiqarilgan yil kiritilmadi!')
    .regex(/^\d{4}$/, 'Yil noto‘g‘ri formatda') // Yil faqat 4 ta raqamdan iborat bo'lishini tekshiradi
    .refine((val) => parseInt(val, 10) <= new Date().getFullYear(), {
      message: 'Ishlab chiqarilgan yil kelajak sanasi bo‘lishi mumkin emas',
    })
    .refine((val) => parseInt(val, 10) >= 1900, {
      // Juda eski sanalarni cheklash (ixtiyoriy)
      message: 'Ishlab chiqarilgan yil juda eski',
    }),
  stateService: z.nativeEnum(stateService, {
    errorMap: () => ({ message: "Davlat xizmatining to'liq nomi tanlanmadi!" }),
  }),
  file1Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file1ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file2Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file2ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file3Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file3ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file4Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file5Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file5ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file6Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file6ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file7Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file7ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file8Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file8ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file9Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file9ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file10Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file11Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file11ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  file12Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file13Path: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  file13ExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  regionId: z
    .string({
      required_error: 'Joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Joylashgan manzil kiritilmadi!'),
});
