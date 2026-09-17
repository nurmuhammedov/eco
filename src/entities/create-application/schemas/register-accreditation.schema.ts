import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { ApplicationTypeEnum } from '../types/enums'

const requiredFile = z.string().min(1)

export const RegisterAccreditationSchema = z.object({
  appealType: z.nativeEnum(ApplicationTypeEnum),

  activityRegionId: z.string().min(1),
  activityDistrictId: z.string().min(1),
  activityAddress: z.string().trim().min(1),

  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), { message: FORM_ERROR_MESSAGES.invalid }),
  email: z.string().trim().email().optional().or(z.literal('')),

  accreditationScopePath: requiredFile,
  organizationCharterPath: requiredFile,
  complianceDeclarationPath: requiredFile,
  expertStaffListPath: requiredFile,
  equipmentAndConditionsPath: requiredFile,
  qmsCertificatePath: requiredFile,
  receiptPath: requiredFile,
})

export type RegisterAccreditationDTO = z.infer<typeof RegisterAccreditationSchema>
