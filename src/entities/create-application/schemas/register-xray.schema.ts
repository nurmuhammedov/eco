import { checkExpiryDate } from '@/shared/lib/zod-helpers'
// src/entities/create-application/schemas/register-irs.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

const __XrayAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  licenseNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  model: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  licenseRegistryNumber: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  licenseDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  licenseExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  serialNumber: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  manufacturedYear: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .min(4, 'Majburiy maydon!')
    .regex(/^\d{4}$/, 'Yil noto‘g‘ri formatda'),
  stateService: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file1Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file1ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file2Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file2ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file3Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file3ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file4Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file5Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file5ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file6Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file6ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file7Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file7ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file8Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file8ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file9Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file9ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file10Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file11Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file11ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file12Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file13Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file13ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  file14Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file14ExpiryDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => format(date, 'yyyy-MM-dd')),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
})

export const XrayAppealDtoSchema = __XrayAppealDtoSchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file1Path', 'file1ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file2Path', 'file2ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file3Path', 'file3ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file6Path', 'file6ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file7Path', 'file7ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file8Path', 'file8ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file9Path', 'file9ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file11Path', 'file11ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file13Path', 'file13ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file14Path', 'file14ExpiryDate'))
