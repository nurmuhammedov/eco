// src/entities/create-application/schemas/register-boiler.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const BoilerIllegalAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Qozon turini tanlanmadi!',
    })
    .min(1, 'Qozon turini tanlanmadi!'),
  factoryNumber: z.string().optional(),
  regionId: z
    .string({
      required_error: 'Qozon joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Qozon joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Qozon joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Qozon joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Qozon joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Qozon joylashgan manzil kiritilmadi!'),
  model: z.string().optional(),
  factory: z.string().optional(),
  location: z
    .string({
      required_error: 'Joylashuv tanlanmadi!',
    })
    .min(1, 'Joylashuv tanlanmadi!'),
  manufacturedAt: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  partialCheckDate: z // Tashqi va ichki ko'rik sanasi
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  fullCheckDate: z // Gidrosinov o'tkazish sanasi
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  labelPath: z.string().optional(),
  labelExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  saleContractPath: z.string().optional(),
  saleContractExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  equipmentCertPath: z.string().optional(),
  equipmentCertExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  assignmentDecreePath: z.string().optional(),
  assignmentDecreeExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  expertisePath: z.string().optional(),
  expertiseExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  installationCertPath: z.string().optional(),
  installationCertExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  additionalFilePath: z.string().optional(),
  additionalFileExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  nonDestructiveCheckDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  capacity: z.string().optional(),
  environment: z.string().optional(),
  pressure: z.string().optional(),
});
