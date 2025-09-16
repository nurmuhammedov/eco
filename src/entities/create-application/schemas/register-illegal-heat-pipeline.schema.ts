// src/entities/create-application/schemas/register-heat-pipeline.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const HeatPipelineIllegalAppealDtoSchema = z.object({
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
  factoryNumber: z.string().optional(),
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
  model: z.string().optional(),
  factory: z.string().optional(),
  location: z
    .string({
      required_error: 'Joylashuv tanlanmadi!',
    })
    .min(1, 'Joylashuv tanlanmadi!'),
  manufacturedAt: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  partialCheckDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  fullCheckDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  labelPath: z.string().optional(),
  labelExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  saleContractPath: z.string().optional(),
  saleContractExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  equipmentCertPath: z.string().optional(),
  equipmentCertExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  assignmentDecreePath: z.string().optional(),
  assignmentDecreeExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  expertisePath: z.string().optional(),
  expertiseExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  installationCertPath: z.string().optional(),
  installationCertExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  additionalFilePath: z.string().optional(), // Ixtiyoriy
  additionalFileExpiryDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  nonDestructiveCheckDate: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  diameter: z.string().optional(),
  thickness: z.string().optional(),
  length: z.string().optional(),
  pressure: z.string().optional(),
  temperature: z.string().optional(),
});
