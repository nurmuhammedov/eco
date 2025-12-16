import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const IrsAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  parentOrganization: z.string().optional(),
  supervisorName: z.string({ required_error: 'Rahbar F.I.Sh. kiritilmadi!' }).min(1, 'Rahbar F.I.Sh. kiritilmadi!'),
  supervisorPosition: z
    .string({ required_error: 'Rahbar lavozimi kiritilmadi!' })
    .min(1, 'Rahbar lavozimi kiritilmadi!'),
  supervisorStatus: z
    .string({ required_error: 'Rahbarning radiatsiya xavfsizligi bo‘yicha tayyorgarlik holati kiritilmadi!' })
    .min(1, 'Rahbarning radiatsiya xavfsizligi bo‘yicha tayyorgarlik holati kiritilmadi!'),
  supervisorEducation: z
    .string({ required_error: "Rahbarning ma'lumoti kiritilmadi!" })
    .min(1, "Rahbarning ma'lumoti kiritilmadi!"),
  supervisorPhoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: 'Rahbar telefon raqami noto‘g‘ri formatda!',
    }),
  division: z.string({ required_error: 'Bo‘linma nomi kiritilmadi!' }).min(1, 'Bo‘linma nomi kiritilmadi!'),
  identifierType: z.nativeEnum(IrsIdentifierType, {
    errorMap: () => ({ message: 'INM identifikatsiya raqami turi tanlanmadi!' }),
  }),
  symbol: z.string({ required_error: 'Radionuklid belgisi kiritilmadi!' }).min(1, 'Radionuklid belgisi kiritilmadi!'),
  sphere: z.string({ required_error: 'Qo‘llash sohasi kiritilmadi!' }).min(1, 'Qo‘llash sohasi kiritilmadi!'),
  factoryNumber: z.string({ required_error: 'Zavod raqami kiritilmadi!' }).min(1, 'Zavod raqami kiritilmadi!'),
  serialNumber: z.string({ required_error: 'Seriya raqami kiritilmadi!' }).min(1, 'Seriya raqami kiritilmadi!'),
  activity: z.coerce
    .number({
      required_error: 'Aktivligi, Bk kiritilmadi!',
      invalid_type_error: 'Aktivligi, Bk raqamda kiritilishi kerak!',
    })
    .positive('Aktivligi musbat son bo‘lishi kerak!'),
  type: z.string({ required_error: 'INM turi kiritilmadi!' }).min(1, 'INM turi kiritilmadi!'),
  category: z.nativeEnum(IrsCategory, {
    errorMap: () => ({ message: 'INM kategoriyasi tanlanmadi!' }),
  }),
  country: z
    .string({ required_error: 'Ishlab chiqarilgan mamlakat kiritilmadi!' })
    .min(1, 'Ishlab chiqarilgan mamlakat kiritilmadi!'),
  manufacturedAt: z
    .date({ required_error: 'Sana kiritilmadi!' })
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  acceptedFrom: z
    .string({ required_error: 'Kimdan olinganligi kiritilmadi!' })
    .min(1, 'Kimdan olinganligi kiritilmadi!'),
  acceptedAt: z.date({ required_error: 'Sana kiritilmadi!' }).transform((date) => date && format(date, 'yyyy-MM-dd')),
  isValid: z.boolean({ required_error: 'INM holati tanlanmadi!', invalid_type_error: 'INM holati noto‘g‘ri formatda' }),
  usageType: z.nativeEnum(IrsUsageType, {
    errorMap: () => ({ message: 'INMdan foydalanish maqsadi tanlanmadi!' }),
  }),
  storageLocation: z.string({ required_error: 'Saqlash joyi kiritilmadi!' }).min(1, 'Saqlash joyi kiritilmadi!'),
  passportPath: z.string({ required_error: 'Pasport fayli biriktirilmadi!' }).min(1, 'Pasport fayli biriktirilmadi!'),
  additionalFilePath: z.string().optional(),
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
