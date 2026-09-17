import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { format } from 'date-fns'
import { z } from 'zod'

const __IrsAppealDtoSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  parentOrganization: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  supervisorName: z.string().trim().min(1),
  supervisorPosition: z.string().trim().min(1),
  supervisorStatus: z.string().trim().min(1),
  supervisorEducation: z.string().trim().min(1),
  supervisorPhoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  division: z.string().trim().min(1),
  identifierType: z.nativeEnum(IrsIdentifierType),
  symbol: z.string().trim().min(1),
  sphere: z.string().trim().min(1),
  factoryNumber: z.string().trim().min(1),
  serialNumber: z.string().trim().min(1),
  activity: z.coerce.number().positive(),
  type: z.string().trim().min(1),
  category: z.nativeEnum(IrsCategory),
  country: z.string().trim().min(1),
  manufacturedAt: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  acceptedFrom: z.string().trim().min(1),
  acceptedAt: z.date().transform((date) => date && format(date, 'yyyy-MM-dd')),
  isValid: z.boolean(),
  usageType: z.nativeEnum(IrsUsageType),
  storageLocation: z.string().trim().min(1),
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
  file17Path: z.string().trim().optional().nullable(),
  file18Path: z.string().trim().optional().nullable(),
  file18ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  regionId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  address: z.string().trim().min(1),
})

export const IrsAppealDtoSchema = __IrsAppealDtoSchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file2Path', 'file2ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file15Path', 'file15ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file18Path', 'file18ExpiryDate'))
