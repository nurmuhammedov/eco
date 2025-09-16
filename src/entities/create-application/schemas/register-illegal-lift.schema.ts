import { BuildingSphereType } from '@/entities/create-application/types/enums';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const LiftIllegalAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO ID noto‘g‘ri formatda!').optional().or(z.literal('')),
  childEquipmentId: z.string({ required_error: 'Lift turi tanlanmadi!' }).min(1, 'Lift turi tanlanmadi!'),
  factoryNumber: z.string().optional(),
  regionId: z.string({ required_error: 'Viloyat tanlanmadi!' }).min(1, 'Viloyat tanlanmadi!'),
  districtId: z.string({ required_error: 'Tuman tanlanmadi!' }).min(1, 'Tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Manzil kiritilmadi!',
    })
    .min(1, 'Manzil kiritilmadi!'),
  model: z.string().optional(),
  factory: z.string().optional(),
  location: z
    .string({
      required_error: 'Joylashuv tanlanmadi!',
    })
    .min(1, 'Joylashuv tanlanmadi!'),
  manufacturedAt: z.string().optional(),
  partialCheckDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  fullCheckDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  labelPath: z
    .string({ required_error: 'Liftning birkasi bilan surʼati fayli biriktirilmadi!' })
    .min(1, 'Liftning birkasi bilan surʼati fayli biriktirilmadi!'),
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
  sphere: z.nativeEnum(BuildingSphereType).optional(),
  liftingCapacity: z.string().optional(),
  stopCount: z.string().optional(),
});
