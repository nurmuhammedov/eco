import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const AttractionIllegalAppealDtoSchema = z
  .object({
    phoneNumber: z
      .string({ message: FORM_ERROR_MESSAGES.required })
      .trim()
      .refine((val) => USER_PATTERNS.phone.test(val), {
        message: FORM_ERROR_MESSAGES.phone,
      }),
    identity: z
      .string({ required_error: 'STIR yoki JSHSHIR kiritilishi shart' })
      .min(9, 'STIR 9 xonali bo‘lishi kerak')
      .max(14, 'JSHSHIR 14 xonali bo‘lishi kerak')
      .regex(/^\d+$/, 'Faqat raqamlar kiritilishi kerak'),
    birthDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
    attractionName: z.string({ required_error: 'Attraksion nomi kiritilmadi!' }).min(1, 'Attraksion nomi kiritilmadi!'),
    childEquipmentId: z.coerce.number({ required_error: 'Attraksion turi tanlanmadi!' }),
    childEquipmentSortId: z.coerce.number({ required_error: 'Attraksion tipi tanlanmadi!' }),
    factory: z.string().optional(),
    manufacturedAt: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),
    acceptedAt: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),
    servicePeriod: z
      .date({ required_error: 'Xizmat muddati kiritilmadi!' })
      .transform((date) => format(date, 'yyyy-MM-dd')),
    factoryNumber: z.string().optional(),
    country: z.string().optional(),
    regionId: z.coerce.number({ required_error: 'Attraksion joylashgan viloyat tanlanmadi!' }),
    districtId: z.coerce.number({ required_error: 'Attraksion joylashgan tuman tanlanmadi!' }),
    address: z
      .string({ required_error: 'Attraksion joylashgan manzil kiritilmadi!' })
      .min(1, 'Attraksion joylashgan manzil kiritilmadi!'),
    location: z.string({ required_error: 'Geolokatsiya tanlanmadi!' }).min(1, 'Geolokatsiya tanlanmadi!'),
    riskLevel: z.enum(['I', 'II', 'III', 'IV']).optional(),

    passportPath: z.string().optional(),
    labelPath: z.string().optional(),
    conformityCertPath: z.string().optional(),
    technicalJournalPath: z.string().optional(),
    qrPath: z.string().optional(),

    preservationActPath: z.string().optional(),
    preservationActExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    servicePlanPath: z.string().optional(),
    servicePlanExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    technicalManualPath: z.string().optional(),
    technicalManualExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    seasonalInspectionPath: z.string().optional(),
    seasonalInspectionExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    seasonalReadinessActPath: z.string().optional(),
    seasonalReadinessActExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    technicalReadinessActPath: z.string().optional(),

    employeeSafetyKnowledgePath: z.string().optional(),
    employeeSafetyKnowledgeExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    usageRightsPath: z.string().optional(),
    usageRightsExpiryDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : undefined)),

    cctvInstallationPath: z.string().optional(),
    filesBuilt: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.identity && data.identity.length === 14) {
      if (!data.birthDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tug‘ilgan sana kiritilishi shart',
          path: ['birthDate'],
        });
      }
    }
  });
