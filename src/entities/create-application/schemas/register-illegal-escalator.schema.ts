// src/entities/create-application/schemas/register-escalator.schema.ts
// import { BuildingSphereType } from '@/entities/create-application/types/enums';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const EscalatorIllegalAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().optional(),
  childEquipmentId: z
    .string({
      required_error: 'Eskalator turini tanlanmadi!',
    })
    .min(1, 'Eskalator turini tanlanmadi!'),
  factoryNumber: z.string().optional(),
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
  additionalFilePath: z.string().optional(),
  additionalFileExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  // sphere: z.nativeEnum(BuildingSphereType, {
  //   errorMap: () => ({ message: 'Soha tanlanmadi!' }),
  // }),
  passengersPerMinute: z.string().optional(),
  length: z.string().optional(),
  speed: z.string().optional(),
  height: z.string().optional(),
});
