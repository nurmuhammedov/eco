// src/entities/create-application/schemas/register-lpg-powered.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const LpgPoweredIllegalAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
  childEquipmentId: z
    .string({
      required_error: 'Qurilma turini tanlanmadi!',
    })
    .min(1, 'Qurilma turini tanlanmadi!'),
  factoryNumber: z.string().optional(),
  regionId: z
    .string({
      required_error: 'Qurilma joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Qurilma joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Qurilma joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Qurilma joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Qurilma joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Qurilma joylashgan manzil kiritilmadi!'),
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
  partialCheckDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
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
  additionalFilePath: z.string().optional(), // Ixtiyoriy
  additionalFileExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  // nonDestructiveCheckDate DTO da yo'q, agar kerak bo'lsa qo'shiladi
  capacity: z.string().optional(),
  pressure: z.string().optional(),
  fuel: z.string().optional(),
  gasSupplyProjectPath: z.string().optional(),
});
