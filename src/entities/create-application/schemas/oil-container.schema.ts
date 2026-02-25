import { z } from 'zod'
import { format } from 'date-fns'

export const OilContainerAppealDtoSchema = z.object({
  phoneNumber: z.string().min(1, { message: 'Majburiy maydon!' }),
  hazardousFacilityId: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  childEquipmentId: z.number({ required_error: 'Majburiy maydon!', invalid_type_error: 'Majburiy maydon!' }),
  regionId: z.string().min(1, { message: 'Majburiy maydon!' }),
  districtId: z.string().min(1, { message: 'Majburiy maydon!' }),
  address: z.string().min(1, { message: 'Majburiy maydon!' }),
  location: z.string().min(1, { message: 'Majburiy maydon!' }),
  capacity: z.string().min(1, { message: 'Majburiy maydon!' }),
  nonDestructiveCheckDate: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  manufacturedAt: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),

  labelPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, { message: 'Majburiy maydon!' }),
  saleContractPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, { message: 'Majburiy maydon!' }),
  equipmentCertPath: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  assignmentDecreePath: z.string({ required_error: 'Majburiy maydon!' }).min(1, { message: 'Majburiy maydon!' }),
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
  passportPath: z.string({ required_error: 'Majburiy maydon!' }).min(1, { message: 'Majburiy maydon!' }),
})
