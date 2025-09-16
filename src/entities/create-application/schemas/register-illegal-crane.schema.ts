import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns'; // format funksiyasini import qilamiz
import { z } from 'zod';

export const IllegalCraneAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().optional(),
  childEquipmentId: z
    .string({
      required_error: 'Kran turi tanlanmadi!',
    })
    .min(1, 'Kran turi tanlanmadi!'),
  factoryNumber: z.string().optional(),
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
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  partialCheckDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  fullCheckDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  boomLength: z.string().optional(),
  liftingCapacity: z.string().optional(),
  labelPath: z.string().optional(),
  // .string({ required_error: "Kranning birkasi bilan sur'ati fayli biriktirilmadi!" })
  // .min(1, "Kranning birkasi bilan sur'ati fayli biriktirilmadi!"),
  // labelExpiryDate: z.date({ required_error: 'Sanasi kiritilmadi!' }),
  saleContractPath: z.string().optional(),
  saleContractExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  equipmentCertPath: z.string().optional(),
  equipmentCertExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  assignmentDecreePath: z.string().optional(),
  assignmentDecreeExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  expertisePath: z.string().optional(),
  expertiseExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  installationCertPath: z.string().optional(),
  installationCertExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
    }),
  additionalFilePath: z.string().optional(),
  additionalFileExpiryDate: z.date().optional(),
});
