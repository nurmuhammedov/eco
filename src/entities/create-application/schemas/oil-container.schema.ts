import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { z } from 'zod'
import { format } from 'date-fns'

const __OilContainerAppealDtoSchema = z.object({
  phoneNumber: z.string().min(1),
  hazardousFacilityId: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  childEquipmentId: z.number(),
  regionId: z.string().min(1),
  districtId: z.string().min(1),
  address: z.string().min(1),
  location: z.string().min(1),
  capacity: z.string().min(1),
  nonDestructiveCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  manufacturedAt: z.date().transform((date) => format(date, 'yyyy-MM-dd')),

  labelPath: z.string().min(1),
  saleContractPath: z.string().min(1),
  equipmentCertPath: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  assignmentDecreePath: z.string().min(1),
  expertisePath: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  expertiseExpiryDate: z
    .union([z.string(), z.date()])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v ? format(new Date(v), 'yyyy-MM-dd') : null)),
  installationCertPath: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  passportPath: z.string().min(1),
  servicePeriod: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
})

export const OilContainerAppealDtoSchema = __OilContainerAppealDtoSchema.superRefine((data: any, ctx: any) =>
  checkExpiryDate(data, ctx, 'expertisePath', 'expertiseExpiryDate')
)
