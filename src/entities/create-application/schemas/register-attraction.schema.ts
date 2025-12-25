import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const AttractionAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  attractionName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  childEquipmentId: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  childEquipmentSortId: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  factory: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  manufacturedAt: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  acceptedAt: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  factoryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  country: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  regionId: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  districtId: z.coerce.number({ required_error: 'Majburiy maydon!' }),
  address: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  location: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  riskLevel: z.enum(['I', 'II', 'III', 'IV'], { required_error: 'Majburiy maydon!' }),
  passportPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  labelPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  conformityCertPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  technicalJournalPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  servicePlanPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  technicalManualPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  seasonalInspectionPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  seasonalInspectionExpiryDate: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  seasonalReadinessActPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  seasonalReadinessActExpiryDate: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  technicalReadinessActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  employeeSafetyKnowledgePath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  employeeSafetyKnowledgeExpiryDate: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  usageRightsPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  usageRightsExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  preservationActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  cctvInstallationPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  qrPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  filesBuilt: z.boolean().default(false).optional(),
})
