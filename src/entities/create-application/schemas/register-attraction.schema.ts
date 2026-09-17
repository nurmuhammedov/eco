import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

const __AttractionAppealDtoSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  attractionName: z.string().min(1),
  childEquipmentId: z.coerce.number(),
  childEquipmentSortId: z.coerce.number(),
  factory: z.string().min(1),
  manufacturedAt: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  acceptedAt: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  factoryNumber: z.string().min(1),
  country: z.string().min(1),
  regionId: z.coerce.number(),
  districtId: z.coerce.number(),
  parkId: z.coerce.number().optional().nullable(),
  address: z.string().min(1),
  location: z.string().min(1),
  riskLevel: z.enum(['I', 'II', 'III', 'IV']),
  passportPath: z.string().min(1),
  labelPath: z.string().min(1),
  conformityCertPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  technicalJournalPath: z.string().min(1),
  servicePlanPath: z.string().min(1),
  technicalManualPath: z.string().min(1),
  seasonalInspectionPath: z.string().min(1),
  seasonalInspectionExpiryDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  seasonalReadinessActPath: z.string().min(1),
  seasonalReadinessActExpiryDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  technicalReadinessActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  employeeSafetyKnowledgePath: z.string().min(1),
  employeeSafetyKnowledgeExpiryDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  usageRightsPath: z.string().optional(),
  usageRightsExpiryDate: z
    .date()
    .optional()
    .nullable()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  preservationActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  cctvInstallationPath: z.string().min(1),
  qrPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  filesBuilt: z.boolean().default(false).optional(),
})

export const AttractionAppealDtoSchema = __AttractionAppealDtoSchema
  .superRefine((data: any, ctx: any) =>
    checkExpiryDate(data, ctx, 'seasonalInspectionPath', 'seasonalInspectionExpiryDate')
  )
  .superRefine((data: any, ctx: any) =>
    checkExpiryDate(data, ctx, 'seasonalReadinessActPath', 'seasonalReadinessActExpiryDate')
  )
  .superRefine((data: any, ctx: any) =>
    checkExpiryDate(data, ctx, 'employeeSafetyKnowledgePath', 'employeeSafetyKnowledgeExpiryDate')
  )
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'usageRightsPath', 'usageRightsExpiryDate'))
