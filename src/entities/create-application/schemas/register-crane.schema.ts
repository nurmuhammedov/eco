import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const CraneAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().optional(),
  childEquipmentId: z.string({
    required_error: 'Kran turi tanlanmadi!',
  }),
  factoryNumber: z.string({ required_error: 'Zavod raqami kiritilmadi!' }),
  regionId: z.string({
    required_error: 'Viloyat tanlanmadi!',
  }),
  districtId: z.string({
    required_error: 'Tuman tanlanmadi!',
  }),
  address: z
    .string({
      required_error: 'Manzil kiritilmadi!',
    })
    .min(1, 'Manzil kiritilmadi!'),
  model: z.string({ required_error: 'Model, marka kiritilmadi!' }),
  factory: z.string({ required_error: 'Zavod nomi kiritilmadi!' }),
  location: z.string({
    required_error: 'Joylashuv tanlanmadi!',
  }),
  manufacturedAt: z.date({ required_error: 'Ishlab chiqarilgan sanasi kiritilmadi!' }),
  partialCheckDate: z.date({ required_error: 'Tekshirish sanasi kiritilmadi!' }),
  fullCheckDate: z.date({ required_error: 'Tekshirish sanasi kiritilmadi!' }),
  boomLength: z.string({ required_error: 'Strela uzunligi kiritilmadi!' }),
  liftingCapacity: z.string({ required_error: "Yuk ko'tara olishi kiritilmadi!" }),

  labelPath: z.string().optional(),
  saleContractPath: z.string().optional(),
  equipmentCertPath: z.string().optional(),
  assignmentDecreePath: z.string().optional(),
  expertisePath: z.string().optional(),
  installationCertPath: z.string().optional(),
  additionalFilePath: z.string().optional(),
  agreementPath: z.string().optional(),
});
