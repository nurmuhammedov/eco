import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

const __BoilerUtilizerAppealDtoSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  hazardousFacilityId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  childEquipmentId: z.string().trim().min(1),
  factoryNumber: z.string().trim().min(1),
  regionId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  address: z.string().trim().min(1),
  model: z.string().trim().min(1),
  factory: z.string().trim().min(1),
  location: z.string().trim().min(1),
  manufacturedAt: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  partialCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  nonDestructiveCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  capacity: z.string().trim().min(1),
  environment: z.string().trim().min(1),
  pressure: z.string().trim().min(1),
  density: z.string().trim().min(1),
  temperature: z.string().trim().min(1),
  usageRightsPath: z.string().trim().optional(),
  labelPath: z.string().trim().min(1),
  assignmentDecreePath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  saleContractPath: z.string().trim().min(1),
  expertisePath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  expertiseExpiryDate: z
    .date()
    .nullable()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  equipmentCertPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  installationCertPath: z.string().trim().min(1),
  passportPath: z.string().trim().min(1),
  fullCheckPath: z.string().trim().min(1),
  nextFullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  partialCheckPath: z.string().trim().min(1),
  nextPartialCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
})

export const BoilerUtilizerAppealDtoSchema = __BoilerUtilizerAppealDtoSchema.superRefine((data: any, ctx: any) =>
  checkExpiryDate(data, ctx, 'expertisePath', 'expertiseExpiryDate')
)
