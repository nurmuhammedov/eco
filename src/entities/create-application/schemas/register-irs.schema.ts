import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { format } from 'date-fns'
import { z } from 'zod'

const __IrsAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  parentOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  supervisorName: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  supervisorPosition: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  supervisorStatus: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  supervisorEducation: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  supervisorPhoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  division: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  identifierType: z.nativeEnum(IrsIdentifierType, {
    errorMap: () => ({ message: 'Majburiy maydon!' }),
  }),
  symbol: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  sphere: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  factoryNumber: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  serialNumber: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  activity: z.coerce
    .number({
      required_error: 'Majburiy maydon!',
      invalid_type_error: 'Raqam bo‘lishi kerak!',
    })
    .positive('Musbat son bo‘lishi kerak!'),
  type: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  category: z.nativeEnum(IrsCategory, {
    errorMap: () => ({ message: 'Majburiy maydon!' }),
  }),
  country: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  manufacturedAt: z
    .date({ required_error: 'Majburiy maydon!' })
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  acceptedFrom: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  acceptedAt: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => date && format(date, 'yyyy-MM-dd')),
  isValid: z.boolean({ required_error: 'Majburiy maydon!', invalid_type_error: 'Majburiy maydon!' }),
  usageType: z.nativeEnum(IrsUsageType, {
    errorMap: () => ({ message: 'Majburiy maydon!' }),
  }),
  storageLocation: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file1Path: z.string().trim().optional().nullable(),
  file1ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  file2Path: z.string().trim().optional().nullable(),
  file2ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  file5Path: z.string().trim().optional().nullable(),
  file5ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  file15Path: z.string().trim().optional().nullable(),
  file15ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
})

export const IrsAppealDtoSchema = __IrsAppealDtoSchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file1Path', 'file1ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file2Path', 'file2ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file15Path', 'file15ExpiryDate'))
