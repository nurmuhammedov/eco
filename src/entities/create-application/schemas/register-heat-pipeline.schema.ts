// src/entities/create-application/schemas/register-heat-pipeline.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const HeatPipelineAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Quvur turini tanlanmadi!',
    })
    .min(1, 'Quvur turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Quvurning zavod raqami kiritilmadi!' })
    .min(1, 'Quvurning zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Quvur joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Quvur joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Quvur joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Quvur joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Quvur joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Quvur joylashgan manzil kiritilmadi!'),
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
    .date({ required_error: 'Qisman texnik ko‘rik sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'To‘liq texnik ko‘rik sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Quvurning birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Quvurning birkasi bilan sur‘ati fayli biriktirilmadi!'),
  labelExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  saleContractExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  equipmentCertPath: z
    .string({ required_error: 'Quvur sertifikati fayli biriktirilmadi!' })
    .min(1, 'Quvur sertifikati fayli biriktirilmadi!'),
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
    .date({ required_error: 'Putur yetkazmaydigan nazoratdan o‘tkazish sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  diameter: z.string({ required_error: 'Diametr, mm kiritilmadi!' }).min(1, 'Diametr, mm kiritilmadi!'),
  thickness: z
    .string({ required_error: 'Devor qalinligi, mm kiritilmadi!' })
    .min(1, 'Devor qalinligi, mm kiritilmadi!'),
  length: z.string({ required_error: 'Uzunligi, m kiritilmadi!' }).min(1, 'Uzunligi, m kiritilmadi!'),
  pressure: z.string({ required_error: 'Bosim, mPa kiritilmadi!' }).min(1, 'Bosim, mPa kiritilmadi!'),
  temperature: z.string({ required_error: 'Harorat, C kiritilmadi!' }).min(1, 'Harorat, C kiritilmadi!'), // Yangi maydon
});
