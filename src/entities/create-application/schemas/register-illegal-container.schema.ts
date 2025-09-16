// src/entities/create-application/schemas/register-container.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const ContainerIllegalAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Idish turini tanlanmadi!',
    })
    .min(1, 'Idish turini tanlanmadi!'),
  factoryNumber: z.string().optional(),
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
  model: z.string().optional(),
  factory: z.string().optional(),
  location: z
    .string({
      required_error: 'Joylashuv tanlanmadi!',
    })
    .min(1, 'Joylashuv tanlanmadi!'),
  manufacturedAt: z.string().optional(),
  partialCheckDate: z // Tashqi va ichki ko'rik sanasi
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  fullCheckDate: z // Gidrosinov o'tkazish sanasi
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  labelPath: z.string().optional(),
  labelExpiryDate: z.string().optional(),
  saleContractPath: z.string().optional(),
  saleContractExpiryDate: z.string().optional(),
  equipmentCertPath: z.string().optional(),
  equipmentCertExpiryDate: z.string().optional(),
  assignmentDecreePath: z.string().optional(),
  assignmentDecreeExpiryDate: z.string().optional(),
  expertisePath: z.string().optional(),
  expertiseExpiryDate: z.string().optional(),
  installationCertPath: z.string().optional(),
  installationCertExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  additionalFilePath: z.string().optional(), // Ixtiyoriy
  additionalFileExpiryDate: z.string().optional(),
  nonDestructiveCheckDate: z.string().optional(),
  capacity: z.string().optional(),
  environment: z.string().optional(),
  pressure: z.string().optional(),
});
