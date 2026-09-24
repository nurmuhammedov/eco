import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const ReRegisterEquipmentSchema = z.object({
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
  type: z.string().trim().min(1),
  regionId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  address: z.string().trim().min(1),
  oldRegistryNumber: z.string().trim().min(1),
  location: z.string().trim().min(1),
  partialCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  fullCheckDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  labelPath: z.string().trim().min(1),
  saleContractPath: z.string().trim().min(1),
  equipmentCertPath: z.string().trim().min(1),
  assignmentDecreePath: z.string().trim().min(1),
  expertisePath: z.string().trim().min(1),
  installationCertPath: z.string().trim().min(1),
})
