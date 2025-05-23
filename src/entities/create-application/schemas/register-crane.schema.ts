import { z } from 'zod';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';

export const CraneAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),

  address: z
    .string({
      required_error: 'Manzil kiritilmadi!',
    })
    .min(1, 'Manzil kiritilmadi!'),
  location: z.string({
    required_error: 'Joylashuv tanlanmadi!',
  }),

  manufacturedAt: z.date({ required_error: 'Ishlab chiqarilgan sanasi kiritilmadi!' }),

  partialCheckDate: z.date({ required_error: 'Tekshirish sanasi kiritilmadi!' }),

  fullCheckDate: z.date({ required_error: 'Tekshirish sanasi kiritilmadi!' }),

  liftingCapacity: z.string({ required_error: "Yuk ko'tara olishi kiritilmadi!" }),
  factory: z.string({ required_error: 'Zavod nomi kiritilmadi!' }),
  factoryNumber: z.string({ required_error: 'Zavod raqami kiritilmadi!' }),
  model: z.string({ required_error: 'Model, marka kiritilmadi!' }),
  boomLength: z.string({ required_error: 'Strela uzunligi kiritilmadi!' }),
  hazardousSubstance: z.string({ required_error: 'Maydon kiritilmadi!' }),
  description: z.string({ required_error: 'Maydon kiritilmadi!' }),

  // Array field
  childEquipmentId: z.string({
    required_error: 'Kran turi tanlanmadi!',
  }),

  regionId: z.string({
    required_error: 'Viloyat tanlanmadi!',
  }),

  districtId: z.string({
    required_error: 'Tuman tanlanmadi!',
  }),
  hazardousFacilityId: z.string({
    required_error: 'XICHO tanlanmadi!',
  }),

  // File fields
  labelPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  saleContractPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  additionalFilePath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  assignmentDecreePath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  expertisePath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  equipmentCertPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  installationCertPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
});
