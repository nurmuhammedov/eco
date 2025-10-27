import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const AttractionAppealDtoSchema = z.object({
  // --- Asosiy qism (o'zgarishsiz) ---
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  attractionName: z.string({ required_error: 'Attraksion nomi kiritilmadi!' }).min(1, 'Attraksion nomi kiritilmadi!'),
  childEquipmentId: z.coerce.number({ required_error: 'Attraksion turi tanlanmadi!' }),
  childEquipmentSortId: z.coerce.number({ required_error: 'Attraksion tipi tanlanmadi!' }),
  factory: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  manufacturedAt: z
    .date({ required_error: 'Ishlab chiqarilgan sana kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  acceptedAt: z
    .date({ required_error: 'Dastlabki foydalanishga qabul qilingan sana kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z
    .date({ required_error: 'Xizmat muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
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

  // --- Fayllar va Sanalar (BACKENDGA MOSLASHTIRILGAN QISM) ---

  // Backendda bor va majburiy
  passportPath: z
    .string({ required_error: 'Attraksion pasporti fayli biriktirilmadi!' })
    .min(1, 'Attraksion pasporti fayli biriktirilmadi!'),
  labelPath: z
    .string({ required_error: 'Attraksionning surati biriktirilmadi!' })
    .min(1, 'Attraksionning surati biriktirilmadi!'),

  // Backendda bor, lekin majburiy emas (yulduzchasi yo'q)
  conformityCertPath: z.string().optional(),

  qrPath: z.string().optional(),
  preservationActPath: z.string().optional(),
  preservationActExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  technicalJournalPath: z
    .string({ required_error: 'Texnik shahodat sinovlari attraksiondan foydalanish qo‘llanmasi... biriktirilmadi!' })
    .min(1, 'Texnik shahodat sinovlari attraksiondan foydalanish qo‘llanmasi... biriktirilmadi!'),
  technicalManualExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  servicePlanPath: z
    .string({ required_error: 'Davriy texnik xizmat ko‘rsatish reja-jadvali biriktirilmadi!' })
    .min(1, 'Davriy texnik xizmat ko‘rsatish reja-jadvali biriktirilmadi!'),
  servicePlanExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda nomi 'technicalManualPath' (sizda 'safetyDecreePath' edi)
  technicalManualPath: z
    .string({ required_error: 'Mas’ul mutaxasis buyrug‘i biriktirilmadi!' })
    .min(1, 'Mas’ul mutaxasis buyrug‘i biriktirilmadi!'),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  seasonalInspectionPath: z
    .string({ required_error: 'Mavsumiy texnik shahodat sinovlari fayli biriktirilmadi!' })
    .min(1, 'Mavsumiy texnik shahodat sinovlari fayli biriktirilmadi!'),

  // Backend sana-string kutadi
  seasonalInspectionExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),

  // Backendda bor va majburiy
  seasonalReadinessActPath: z
    .string({ required_error: 'Mavsumga tayyorligi to‘g‘risidagi dalolatnoma biriktirilmadi!' })
    .min(1, 'Mavsumga tayyorligi to‘g‘risidagi dalolatnoma biriktirilmadi!'),

  // Backend sana-string kutadi
  seasonalReadinessActExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),

  // Backendda bor, lekin majburiy emas (sizda majburiy edi)
  technicalReadinessActPath: z.string().optional(),
  cctvInstallationPath: z.string().optional(),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  employeeSafetyKnowledgePath: z
    .string({ required_error: 'Xodimlar bilim sinovi ma’lumoti biriktirilmadi!' })
    .min(1, 'Xodimlar bilim sinovi ma’lumoti biriktirilmadi!'),

  // Backend sana-string kutadi
  employeeSafetyKnowledgeExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  usageRightsPath: z
    .string({ required_error: 'Ruxsatnoma fayli biriktirilmadi!' })
    .min(1, 'Ruxsatnoma fayli biriktirilmadi!'),

  // Backend sana-string kutadi
  usageRightsExpiryDate: z
    .date({ required_error: 'Amal qilish muddati kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),

  // Backendda bor
  filesBuilt: z.boolean().default(false).optional(),
});
