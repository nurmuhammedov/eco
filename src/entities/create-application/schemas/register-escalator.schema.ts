// src/entities/create-application/schemas/register-escalator.schema.ts
// import { BuildingSphereType } from '@/entities/create-application/types/enums';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const EscalatorAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')),
  childEquipmentId: z
    .string({
      required_error: 'Eskalator turini tanlanmadi!',
    })
    .min(1, 'Eskalator turini tanlanmadi!'),
  factoryNumber: z
    .string({ required_error: 'Eskalatorning zavod raqami kiritilmadi!' })
    .min(1, 'Eskalatorning zavod raqami kiritilmadi!'),
  regionId: z
    .string({
      required_error: 'Eskalator joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Eskalator joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Eskalator joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Eskalator joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Eskalator joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Eskalator joylashgan manzil kiritilmadi!'),
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
    .date({ required_error: 'O‘tkazilgan qisman texnik ko‘rik sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'To‘liq texnik ko‘rik sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Eskalatorning birkasi bilan sur‘ati fayli biriktirilmadi!' })
    .min(1, 'Eskalatorning birkasi bilan sur‘ati fayli biriktirilmadi!'),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  equipmentCertPath: z
    .string({ required_error: 'Eskalator sertifikati fayli biriktirilmadi!' })
    .min(1, 'Eskalator sertifikati fayli biriktirilmadi!'),
  assignmentDecreePath: z
    .string({ required_error: "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!" })
    .min(1, "Mas'ul shaxs tayinlanganligi to'g'risida buyruq fayli biriktirilmadi!"),
  expertisePath: z
    .string({ required_error: 'Ekspertiza loyihasi fayli biriktirilmadi!' })
    .min(1, 'Ekspertiza loyihasi fayli biriktirilmadi!'),
  installationCertPath: z
    .string({ required_error: 'Montaj guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Montaj guvohnomasi fayli biriktirilmadi!'),
  additionalFilePath: z.string().optional(),
  // sphere: z.nativeEnum(BuildingSphereType, {
  //   errorMap: () => ({ message: 'Soha tanlanmadi!' }),
  // }),
  passengersPerMinute: z // DTO dagi liftingCapacity o'rniga
    .string({ required_error: 'O‘tkazish qobiliyati, kishi/soat kiritilmadi!' })
    .min(1, 'O‘tkazish qobiliyati, kishi/soat kiritilmadi!'),
  length: z // DTO dagi stopCount o'rniga
    .string({ required_error: 'Uzunligi kiritilmadi!' })
    .min(1, 'Uzunligi kiritilmadi!'),
  speed: z // Yangi maydon
    .string({ required_error: 'Tezligi kiritilmadi!' })
    .min(1, 'Tezligi kiritilmadi!'),
  height: z // Yangi maydon
    .string({ required_error: 'Ko‘tarish balandligi kiritilmadi!' })
    .min(1, 'Ko‘tarish balandligi kiritilmadi!'),
});
