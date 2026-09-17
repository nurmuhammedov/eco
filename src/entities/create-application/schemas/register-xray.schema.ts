import { checkExpiryDate } from '@/shared/lib/zod-helpers'
// src/entities/create-application/schemas/register-irs.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

const __XrayAppealDtoSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  licenseNumber: z.string().min(1),
  model: z.string().trim().min(1),
  licenseRegistryNumber: z.string().trim().min(1),
  licenseDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  licenseExpiryDate: z
    .date()
    .transform((date) => format(date, 'yyyy-MM-dd'))
    .optional(),
  serialNumber: z.string().trim().min(1),
  manufacturedYear: z
    .string()
    .trim()
    .min(4)
    .regex(/^\d{4}$/),
  stateService: z.string().trim().min(1),
  file5Path: z.string().trim().optional().nullable(),
  file5ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  file7Path: z.string().trim().optional().nullable(),
  file7ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  file9Path: z.string().trim().optional().nullable(),
  file9ExpiryDate: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .transform((val) => (val ? format(new Date(val), 'yyyy-MM-dd') : null)),
  file14Path: z.string().trim().min(1),
  file14ExpiryDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  file8Path: z.string().trim().min(1),
  file8ExpiryDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  regionId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  address: z.string().trim().min(1),
})

export const XrayAppealDtoSchema = __XrayAppealDtoSchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file7Path', 'file7ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file9Path', 'file9ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file14Path', 'file14ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file8Path', 'file8ExpiryDate'))
