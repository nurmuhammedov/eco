import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

const __CablewayAppealDtoSchema = z.object({
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

  speed: z.string().trim().min(1),
  passengerCount: z.string().trim().min(1),
  length: z.string().trim().min(1),

  usageRightsPath: z.string().trim().optional(),
  labelPath: z.string().trim().min(1),

  assignmentDecreePath: z.string().trim().min(1),

  passportPath: z.string().trim().min(1),

  saleContractPath: z.string().trim().min(1),

  expertisePath: z.string().trim().min(1),
  expertiseExpiryDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),

  equipmentCertPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),

  installationCertPath: z.string().trim().min(1),

  fullCheckPath: z.string().trim().min(1),
  nextFullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  servicePeriod: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
})

export const CablewayAppealDtoSchema = __CablewayAppealDtoSchema.superRefine((data: any, ctx: any) =>
  checkExpiryDate(data, ctx, 'expertisePath', 'expertiseExpiryDate')
)
