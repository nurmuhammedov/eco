import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const AttractionPassportAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  attractionName: z.string({ required_error: 'Attraksion nomi kiritilmadi!' }).min(1, 'Attraksion nomi kiritilmadi!'),
  childEquipmentId: z.coerce.number({ required_error: 'Attraksion turi tanlanmadi!' }),
  childEquipmentSortId: z.coerce.number({ required_error: 'Attraksion tipi tanlanmadi!' }),
  manufacturedAt: z
    .date({ required_error: 'Ishlab chiqarilgan sana kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  acceptedAt: z
    .date({ required_error: 'Dastlabki foydalanishga qabul qilingan sana kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.coerce.number({ required_error: 'Xizmat muddati (yil) kiritilmadi!' }),
  factoryNumber: z
    .string({ required_error: 'Attraksion zavod raqami kiritilmadi!' })
    .min(1, 'Attraksion zavod raqami kiritilmadi!'),
  country: z
    .string({ required_error: 'Ishlab chiqarilgan mamlakat kiritilmadi!' })
    .min(1, 'Ishlab chiqarilgan mamlakat kiritilmadi!'),
  regionId: z.coerce.number({ required_error: 'Attraksion joylashgan viloyat tanlanmadi!' }),
  districtId: z.coerce.number({ required_error: 'Attraksion joylashgan tuman tanlanmadi!' }),
  address: z
    .string({ required_error: 'Attraksion joylashgan manzil kiritilmadi!' })
    .min(1, 'Attraksion joylashgan manzil kiritilmadi!'),
  location: z.string({ required_error: 'Geolokatsiya tanlanmadi!' }).min(1, 'Geolokatsiya tanlanmadi!'),
  riskLevel: z.enum(['I', 'II', 'III', 'IV'], { required_error: 'Biomexanik xavf darajasi tanlanmadi!' }),

  // File paths
  labelPath: z
    .string({ required_error: 'Attraksionning birkasi bilan surati biriktirilmadi!' })
    .min(1, 'Attraksionning birkasi bilan surati biriktirilmadi!'),
  labelExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  passportPath: z
    .string({ required_error: 'Attraksion pasporti fayli biriktirilmadi!' })
    .min(1, 'Attraksion pasporti fayli biriktirilmadi!'),
  passportExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  equipmentCertPath: z
    .string({ required_error: 'Attraksion sertifikati fayli biriktirilmadi!' })
    .min(1, 'Attraksion sertifikati fayli biriktirilmadi!'),
  equipmentCertExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  acceptanceCertPath: z
    .string({ required_error: 'Attraksionni foydalanishga qabul qilish guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Attraksionni foydalanishga qabul qilish guvohnomasi fayli biriktirilmadi!'),
  assignmentDecreePath: z
    .string({ required_error: 'Masʼul shaxs tayinlanganligi toʻgʻrisida buyruq fayli biriktirilmadi!' })
    .min(1, 'Masʼul shaxs tayinlanganligi toʻgʻrisida buyruq fayli biriktirilmadi!'),
  assignmentDecreeExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  techReadinessActPath: z
    .string({ required_error: 'Attraksion texnik tayyorligi toʻgʻrisida dalolatnoma biriktirilmadi!' })
    .min(1, 'Attraksion texnik tayyorligi toʻgʻrisida dalolatnoma biriktirilmadi!'),
  seasonalReadinessActPath: z
    .string({ required_error: 'Attraksion mavsumga tayyorligi toʻgʻrisida dalolatnoma biriktirilmadi!' })
    .min(1, 'Attraksion mavsumga tayyorligi toʻgʻrisida dalolatnoma biriktirilmadi!'),
  safetyDecreePath: z
    .string({
      required_error:
        'Attraksionni soz holatda va undan xavfsiz foydalanish boʻyicha masʼul shaxs buyrugʻi biriktirilmadi!',
    })
    .min(1, 'Attraksionni soz holatda va undan xavfsiz foydalanish boʻyicha masʼul shaxs buyrugʻi biriktirilmadi!'),

  filesBuilt: z.boolean().default(false).optional(),
})
