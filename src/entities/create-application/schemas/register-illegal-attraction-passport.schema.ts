import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const AttractionIllegalPassportAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  attractionName: z.string({ required_error: 'Attraksion nomi kiritilmadi!' }).min(1, 'Attraksion nomi kiritilmadi!'),
  childEquipmentId: z.coerce.number({ required_error: 'Attraksion turi tanlanmadi!' }),
  childEquipmentSortId: z.coerce.number().optional(),
  manufacturedAt: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  acceptedAt: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  servicePeriod: z.coerce.number({ required_error: 'Xizmat muddati (yil) kiritilmadi!' }),
  factoryNumber: z.string().optional(),
  country: z
    .string({ required_error: 'Ishlab chiqarilgan mamlakat kiritilmadi!' })
    .min(1, 'Ishlab chiqarilgan mamlakat kiritilmadi!'),
  regionId: z.coerce.number({ required_error: 'Attraksion joylashgan viloyat tanlanmadi!' }),
  districtId: z.coerce.number({ required_error: 'Attraksion joylashgan tuman tanlanmadi!' }),
  address: z
    .string({ required_error: 'Attraksion joylashgan manzil kiritilmadi!' })
    .min(1, 'Attraksion joylashgan manzil kiritilmadi!'),
  location: z.string({ required_error: 'Geolokatsiya tanlanmadi!' }).min(1, 'Geolokatsiya tanlanmadi!'),
  riskLevel: z.enum(['I', 'II', 'III', 'IV']).optional(),

  // File paths
  labelPath: z.string().optional(),
  labelExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  passportPath: z.string().optional(),
  passportExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  equipmentCertPath: z.string().optional(),
  equipmentCertExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  acceptanceCertPath: z.string().optional(),
  assignmentDecreePath: z.string().optional(),
  assignmentDecreeExpiryDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  techReadinessActPath: z.string().optional(),
  seasonalReadinessActPath: z.string().optional(),
  safetyDecreePath: z.string().optional(),

  filesBuilt: z.boolean().default(false).optional(),
});
