import { BuildingSphereType } from '@/entities/create-application/types/enums';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const LifAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO ID noto‘g‘ri formatda!').optional().or(z.literal('')),
  childEquipmentId: z.string({ required_error: 'Lift turi tanlanmadi!' }).min(1, 'Lift turi tanlanmadi!'),
  factoryNumber: z.string({ required_error: 'Zavod raqami kiritilmadi!' }).min(1, 'Zavod raqami kiritilmadi!'),
  regionId: z.string({ required_error: 'Viloyat tanlanmadi!' }).min(1, 'Viloyat tanlanmadi!'),
  districtId: z.string({ required_error: 'Tuman tanlanmadi!' }).min(1, 'Tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Manzil kiritilmadi!',
    })
    .min(1, 'Manzil kiritilmadi!'),
  model: z.string({ required_error: 'Model, marka kiritilmadi!' }).min(1, 'Model, marka kiritilmadi!'),
  factory: z.string({ required_error: 'Zavod nomi kiritilmadi!' }).min(1, 'Zavod nomi kiritilmadi!'),
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
    .date({ required_error: 'Toʼliq texnik koʼrik sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Liftning birkasi bilan surʼati fayli biriktirilmadi!' })
    .min(1, 'Liftning birkasi bilan surʼati fayli biriktirilmadi!'),
  saleContractPath: z
    .string({ required_error: 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!' })
    .min(1, 'Sotib olish-sotish shartnomasi fayli biriktirilmadi!'),
  equipmentCertPath: z
    .string({ required_error: 'Qurilma sertifikati fayli biriktirilmadi!' })
    .min(1, 'Qurilma sertifikati fayli biriktirilmadi!'),
  assignmentDecreePath: z
    .string({ required_error: 'Masʼul shaxs tayinlanganligi to‘g‘risida buyruq fayli biriktirilmadi!' })
    .min(1, 'Masʼul shaxs tayinlanganligi to‘g‘risida buyruq fayli biriktirilmadi!'),
  expertisePath: z
    .string({ required_error: 'Ekspertiza loyihasi fayli biriktirilmadi!' })
    .min(1, 'Ekspertiza loyihasi fayli biriktirilmadi!'),
  installationCertPath: z
    .string({ required_error: 'Montaj guvohnomasi fayli biriktirilmadi!' })
    .min(1, 'Montaj guvohnomasi fayli biriktirilmadi!'),
  additionalFilePath: z.string().optional(),
  sphere: z.nativeEnum(BuildingSphereType, {
    errorMap: () => ({ message: 'Soha tanlanmadi!' }),
  }),
  liftingCapacity: z
    .string({ required_error: "Yuk ko'tara olish quvvati kiritilmadi!" })
    .min(1, "Yuk ko'tara olish quvvati kiritilmadi!"),
  stopCount: z.string({ required_error: 'Toʼxtashlar soni kiritilmadi!' }).min(1, 'Toʼxtashlar soni kiritilmadi!'),
});
