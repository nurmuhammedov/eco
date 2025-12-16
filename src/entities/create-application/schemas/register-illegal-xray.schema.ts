// src/entities/create-application/schemas/register-irs.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format, parseISO } from 'date-fns'
import { z } from 'zod'

export const XrayIllegalAppealDtoSchema = z.object({
  legalTin: z.string().min(9, "STIR 9 ta raqamdan iborat bo'lishi kerak"),
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  licenseNumber: z.string().optional(),
  model: z.string({ required_error: 'Model kiritilmadi!' }).min(1, 'Model kiritilmadi!'),
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
  stateService: z
    .string({
      required_error: "Davlat xizmatining to'liq nomi tanlanmadi!",
    })
    .min(1, 'Joylashgan tuman tanlanmadi!'),
  file1Path: z.string().optional(),
  file1ExpiryDate: z.date().optional(),
  file2Path: z.string().optional(),
  file2ExpiryDate: z.date().optional(),
  file3Path: z.string().optional(),
  file3ExpiryDate: z.date().optional(),
  file4Path: z.string().optional(),
  file5Path: z.string().optional(),
  file5ExpiryDate: z.date().optional(),
  file6Path: z.string().optional(),
  file6ExpiryDate: z.date().optional(),
  file7Path: z.string().optional(),
  file7ExpiryDate: z.date().optional(),
  file8Path: z.string().optional(),
  file8ExpiryDate: z.date().optional(),
  file9Path: z.string().optional(),
  file9ExpiryDate: z.date().optional(),
  file10Path: z.string().optional(),
  file11Path: z.string().optional(),
  file11ExpiryDate: z.date().optional(),
  file12Path: z.string().optional(),
  file13Path: z.string().optional(),
  file13ExpiryDate: z.date().optional(),
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
})
