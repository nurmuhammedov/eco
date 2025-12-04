import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { format } from 'date-fns'

export const ReRegisterEquipmentSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().optional(),
  type: z.string({
    required_error: 'Majburiy maydon',
  }),
  regionId: z
    .string({
      required_error: 'Viloyat tanlanmadi!',
    })
    .min(1, 'Viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Tuman tanlanmadi!',
    })
    .min(1, 'Tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Manzil kiritilmadi!',
    })
    .min(1, 'Manzil kiritilmadi!'),
  oldRegistryNumber: z
    .string({
      required_error: 'Majburiy maydon!',
    })
    .min(1, 'Majburiy maydon!'),
  location: z
    .string({
      required_error: 'Joylashuv tanlanmadi!',
    })
    .min(1, 'Joylashuv tanlanmadi!'),
  partialCheckDate: z
    .date({ required_error: 'Tekshirish sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date({ required_error: 'Tekshirish sanasi kiritilmadi!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: "Qurilmaning sur'ati fayli biriktirilmadi!" })
    .min(1, "Qurilmaning sur'ati fayli biriktirilmadi!"),
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
})
