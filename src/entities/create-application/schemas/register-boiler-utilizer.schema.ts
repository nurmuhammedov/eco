// src/entities/create-application/schemas/register-boiler-utilizer.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const BoilerUtilizerAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Qozon utilizator turini tanlanmadi!',
    })
    .min(1, 'Qozon utilizator turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Qozon utilizatorining zavod raqami kiritilmadi!' })
    .min(1, 'Qozon utilizatorining zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Qozon utilizatori joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Qozon utilizatori joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Qozon utilizatori joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Qozon utilizatori joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Qozon utilizatori joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Qozon utilizatori joylashgan manzil kiritilmadi!'),
  model: z.string({ required_error: 'Model, marka kiritilmadi!' }).min(1, 'Model, marka kiritilmadi!'),
  factory: z
    .string({ required_error: 'Ishlab chiqargan zavod nomi kiritilmadi!' })
    .min(1, 'Ishlab chiqargan zavod nomi kiritilmadi!'),
  location: z
    .string({
      required_error: 'Joylashuv tanlanmadi!',
    })
    .min(1, 'Joylashuv tanlanmadi!'),
  manufacturedAt: z
    .date({ required_error: 'Ishlab chiqarilgan sana kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  partialCheckDate: z
    .date({ required_error: 'O‘tkazilgan tashki (NO), ichki koʻrik (VO) yoki gidrosinov (GI) sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'O‘tkaziladigan tashki (NO), ichki koʻrik (VO) yoki gidrosinov (GI) sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Qozon utilizatorining birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Qozon utilizatorining birkasi bilan sur‘ati fayli biriktirilmadi!'),
  labelExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  saleContractExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  equipmentCertPath: z
    .string({ required_error: 'Qurilma sertifikati fayli biriktirilmadi!' })
    .min(1, 'Qurilma sertifikati fayli biriktirilmadi!'),
  equipmentCertExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  assignmentDecreePath: z
    .string({ required_error: "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!" })
    .min(1, "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!"),
  assignmentDecreeExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  expertisePath: z
    .string({ required_error: 'Ekspertiza loyihasi fayli biriktirilmadi!' })
    .min(1, 'Ekspertiza loyihasi fayli biriktirilmadi!'),
  expertiseExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  installationCertPath: z
    .string({ required_error: 'Montaj guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Montaj guvohnomasi fayli biriktirilmadi!'),
  installationCertExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  additionalFilePath: z.string().optional(), // Ixtiyoriy
  additionalFileExpiryDate: z.date().optional(), // Ixtiyoriy
  nonDestructiveCheckDate: z
    .date({ required_error: 'Oxirgi o‘tkazilgan putur yetkazmaydigan nazorat sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  capacity: z.string({ required_error: 'Hajmi kiritilmadi!' }).min(1, 'Hajmi kiritilmadi!'),
  environment: z.string({ required_error: 'Muhit kiritilmadi!' }).min(1, 'Muhit kiritilmadi!'),
  pressure: z.string({ required_error: 'Bosim, mPa kiritilmadi!' }).min(1, 'Bosim, mPa kiritilmadi!'),
  density: z.string({ required_error: 'Zichligi, kg/m³ kiritilmadi!' }).min(1, 'Zichligi, kg/m³ kiritilmadi!'), // Yangi maydon
  temperature: z.string({ required_error: 'Harorat, °C kiritilmadi!' }).min(1, 'Harorat, °C kiritilmadi!'),
});
