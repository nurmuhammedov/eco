// src/entities/create-application/schemas/register-hoist.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const HoistAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Yuk ko‘targich turini tanlanmadi!',
    })
    .min(1, 'Yuk ko‘targich turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Yuk ko‘targichning zavod raqami kiritilmadi!' })
    .min(1, 'Yuk ko‘targichning zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Yuk ko‘targich joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Yuk ko‘targich joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Yuk ko‘targich joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Yuk ko‘targich joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Yuk ko‘targich joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Yuk ko‘targich joylashgan manzil kiritilmadi!'),
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
    .date({ required_error: 'O‘tkazilgan qisman (CHTO) yoki toʻliq texnik koʻrik (PTO) sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'O‘tkaziladigan qisman (CHTO) yoki toʻliq texnik koʻrik (PTO) sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Yuk ko‘targichning birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Yuk ko‘targichning birkasi bilan sur‘ati fayli biriktirilmadi!'),
  labelExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  equipmentCertPath: z
    .string({ required_error: 'Yuk ko‘targich sertifikati fayli biriktirilmadi!' })
    .min(1, 'Yuk ko‘targich sertifikati fayli biriktirilmadi!'),
  saleContractExpiryDate: z.date({ required_error: 'Sana kiritilmadi!' }),
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
  height: z.string({ required_error: 'Ko‘tarish balandligi kiritilmadi!' }).min(1, 'Ko‘tarish balandligi kiritilmadi!'),
  liftingCapacity: z
    .string({ required_error: 'Yuk ko‘tarish qobiliyati kiritilmadi!' })
    .min(1, 'Yuk ko‘tarish qobiliyati kiritilmadi!'),
});
