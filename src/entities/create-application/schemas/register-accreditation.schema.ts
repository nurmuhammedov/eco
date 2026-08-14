import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { z } from 'zod'
import { ApplicationTypeEnum } from '../types/enums'

const requiredFile = z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!')

export const RegisterAccreditationSchema = z.object({
  appealType: z.nativeEnum(ApplicationTypeEnum, { required_error: 'Majburiy maydon!' }),

  activityRegionId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  activityDistrictId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  activityAddress: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),

  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), { message: FORM_ERROR_MESSAGES.phone }),
  email: z.string().trim().email('Elektron pochta manzili noto‘g‘ri kiritildi').optional().or(z.literal('')),

  accreditationScopePath: requiredFile,
  organizationCharterPath: requiredFile,
  complianceDeclarationPath: requiredFile,
  expertStaffListPath: requiredFile,
  equipmentAndConditionsPath: requiredFile,
  qmsCertificatePath: requiredFile,
  receiptPath: requiredFile,
})

export type RegisterAccreditationDTO = z.infer<typeof RegisterAccreditationSchema>
