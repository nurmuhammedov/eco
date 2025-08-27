// src/entities/create-application/schemas/register-cableway.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const CablewayAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Osma yo‘l turini tanlanmadi!',
    })
    .min(1, 'Osma yo‘l turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Osma yo‘lning zavod raqami kiritilmadi!' })
    .min(1, 'Osma yo‘lning zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Osma yo‘l joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Osma yo‘l joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Osma yo‘l joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Osma yo‘l joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Osma yo‘l joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Osma yo‘l joylashgan manzil kiritilmadi!'),
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
    .string({ required_error: 'Osma yo‘lning birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Osma yo‘lning birkasi bilan sur‘ati fayli biriktirilmadi!'),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  equipmentCertPath: z
    .string({ required_error: 'Osma yo‘l sertifikati fayli biriktirilmadi!' })
    .min(1, 'Osma yo‘l sertifikati fayli biriktirilmadi!'),
  assignmentDecreePath: z
    .string({ required_error: "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!" })
    .min(1, "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!"),
  expertisePath: z
    .string({ required_error: 'Ekspertiza loyihasi fayli biriktirilmadi!' })
    .min(1, 'Ekspertiza loyihasi fayli biriktirilmadi!'),
  installationCertPath: z
    .string({ required_error: 'Montaj guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Montaj guvohnomasi fayli biriktirilmadi!'),
  additionalFilePath: z.string().optional(), // Ixtiyoriy
  nonDestructiveCheckDate: z
    .date({ required_error: 'Oxirgi o‘tkazilgan putur yetkazmaydigan nazorat sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  speed: z.string({ required_error: 'Harakat tezligi kiritilmadi!' }).min(1, 'Harakat tezligi kiritilmadi!'),
  passengerCount: z
    .string({ required_error: 'Yo‘lovchilar soni kiritilmadi!' })
    .min(1, 'Yo‘lovchilar soni kiritilmadi!'),
  length: z.string({ required_error: 'Uzunligi kiritilmadi!' }).min(1, 'Uzunligi kiritilmadi!'),
});
