// src/entities/create-application/schemas/register-lpg-powered.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const LpgPoweredAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Qurilma turini tanlanmadi!',
    })
    .min(1, 'Qurilma turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Qurilmaning zavod raqami kiritilmadi!' })
    .min(1, 'Qurilmaning zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Qurilma joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Qurilma joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Qurilma joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Qurilma joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Qurilma joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Qurilma joylashgan manzil kiritilmadi!'),
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
    .date({ required_error: 'O‘tkazilgan tashki (NO), ichki koʻrik (VO) yoki gidrosinov (GI) sanasi kiritilmadi!' }) // Rasmda bu maydon yo'q, lekin DTO da bor
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'O‘tkaziladigan tashki (NO), ichki koʻrik (VO) yoki gidrosinov (GI) sanasi kiritilmadi!' }) // Rasmda bu maydon yo'q, lekin DTO da bor
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Qurilmaning birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Qurilmaning birkasi bilan sur‘ati fayli biriktirilmadi!'),
  labelExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  saleContractExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  equipmentCertPath: z
    .string({ required_error: 'Qurilma sertifikati fayli biriktirilmadi!' })
    .min(1, 'Qurilma sertifikati fayli biriktirilmadi!'),
  equipmentCertExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  assignmentDecreePath: z
    .string({ required_error: "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!" })
    .min(1, "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!"),
  assignmentDecreeExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  expertisePath: z
    .string({ required_error: 'Ekspertiza loyihasi fayli biriktirilmadi!' })
    .min(1, 'Ekspertiza loyihasi fayli biriktirilmadi!'),
  expertiseExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  installationCertPath: z
    .string({ required_error: 'Montaj guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Montaj guvohnomasi fayli biriktirilmadi!'),
  installationCertExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  additionalFilePath: z.string().optional(), // Ixtiyoriy
  additionalFileExpiryDate: z.date().optional(), // Ixtiyoriy
  // nonDestructiveCheckDate DTO da yo'q, agar kerak bo'lsa qo'shiladi
  capacity: z
    .string({ required_error: 'Sarflash miqdori, m³/soat kiritilmadi!' })
    .min(1, 'Sarflash miqdori, m³/soat kiritilmadi!'), // "Hajmi" emas, "Sarflash miqdori, m³/soat"
  pressure: z.string({ required_error: 'Bosim, mPa kiritilmadi!' }).min(1, 'Bosim, mPa kiritilmadi!'),
  fuel: z.string({ required_error: 'Yoqilg‘i turi kiritilmadi!' }).min(1, 'Yoqilg‘i turi kiritilmadi!'), // Yangi maydon
  gasSupplyProjectPath: z
    .string({ required_error: "Gaz ta'minoti loyihasi fayli biriktirilmadi!" })
    .min(1, "Gaz ta'minoti loyihasi fayli biriktirilmadi!"), // Yangi fayl maydoni
});
