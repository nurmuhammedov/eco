// src/entities/create-application/schemas/register-chemical-container.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const ChemicalContainerAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Idish turini tanlanmadi!',
    })
    .min(1, 'Idish turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Idishning zavod raqami kiritilmadi!' })
    .min(1, 'Idishning zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Idish joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Idish joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Idish joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Idish joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Idish joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Idish joylashgan manzil kiritilmadi!'),
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
    .date({ required_error: 'Tashqi va ichki ko‘rik sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'Gidrosinov o‘tkazish sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Idishning birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Idishning birkasi bilan sur‘ati fayli biriktirilmadi!'),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  equipmentCertPath: z
    .string({ required_error: 'Idish sertifikati fayli biriktirilmadi!' })
    .min(1, 'Idish sertifikati fayli biriktirilmadi!'),
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
    .date({ required_error: 'Putur yetkazmaydigan nazoratdan o‘tkazish sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  capacity: z.string({ required_error: 'Hajmi kiritilmadi!' }).min(1, 'Hajmi kiritilmadi!'),
  environment: z.string({ required_error: 'Muhit kiritilmadi!' }).min(1, 'Muhit kiritilmadi!'),
  pressure: z
    .string({ required_error: 'Ruxsat etilgan bosim kiritilmadi!' })
    .min(1, 'Ruxsat etilgan bosim kiritilmadi!'),
});
