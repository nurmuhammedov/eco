import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const AttractionIllegalAppealDtoSchema = z.object({
  // --- Asosiy qism (o'zgarishsiz) ---
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  attractionName: z.string({ required_error: 'Attraksion nomi kiritilmadi!' }).min(1, 'Attraksion nomi kiritilmadi!'),
  childEquipmentId: z.coerce.number({ required_error: 'Attraksion turi tanlanmadi!' }),
  childEquipmentSortId: z.coerce.number({ required_error: 'Attraksion tipi tanlanmadi!' }),
  identity: z.string().min(9, "STIR 9 ta raqamdan iborat bo'lishi kerak"),
  factory: z.string().optional(),
  manufacturedAt: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),
  acceptedAt: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),
  servicePeriod: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),
  factoryNumber: z.string().optional(),
  country: z.string().optional(),
  regionId: z.coerce.number({ required_error: 'Attraksion joylashgan viloyat tanlanmadi!' }),
  districtId: z.coerce.number({ required_error: 'Attraksion joylashgan tuman tanlanmadi!' }),
  address: z
    .string({ required_error: 'Attraksion joylashgan manzil kiritilmadi!' })
    .min(1, 'Attraksion joylashgan manzil kiritilmadi!'),
  location: z.string({ required_error: 'Geolokatsiya tanlanmadi!' }).min(1, 'Geolokatsiya tanlanmadi!'),
  riskLevel: z.enum(['I', 'II', 'III', 'IV']).optional(),

  // --- Fayllar va Sanalar (BACKENDGA MOSLASHTIRILGAN QISM) ---

  // Backendda bor va majburiy
  passportPath: z.string().optional(),
  labelPath: z.string().optional(),

  // Backendda bor, lekin majburiy emas (yulduzchasi yo'q)
  conformityCertPath: z.string().optional(),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  technicalJournalPath: z.string().optional(),
  qrPath: z.string().optional(),
  preservationActPath: z.string().optional(),
  preservationActExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  servicePlanPath: z.string().optional(),
  servicePlanExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda nomi 'technicalManualPath' (sizda 'safetyDecreePath' edi)
  technicalManualPath: z.string().optional(),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  seasonalInspectionPath: z.string().optional(),

  // Backend sana-string kutadi
  seasonalInspectionExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda bor va majburiy
  seasonalReadinessActPath: z.string().optional(),

  // Backend sana-string kutadi
  seasonalReadinessActExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda bor, lekin majburiy emas (sizda majburiy edi)
  technicalReadinessActPath: z.string().optional(),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  employeeSafetyKnowledgePath: z.string().optional(),

  technicalManualExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backend sana-string kutadi
  employeeSafetyKnowledgeExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda bor va majburiy (sizning sxemangizda yo'q edi)
  usageRightsPath: z.string().optional(),

  // Backend sana-string kutadi
  usageRightsExpiryDate: z
    .date()
    .optional()
    .transform((date) => {
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),

  // Backendda bor
  filesBuilt: z.boolean().default(false).optional(),
});
