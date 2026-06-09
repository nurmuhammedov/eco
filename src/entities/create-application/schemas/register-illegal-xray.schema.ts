import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const RegisterIllegalXrayBaseSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  identity: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .regex(/^\d+$/, 'Faqat raqamlar bo‘lishi kerak')
    .refine((val) => val.length === 9 || val.length === 14, {
      message: 'STIR 9 yoki JSHSHIR 14 xonadan iborat bo‘lishi kerak',
    }),
  birthDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
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
  regionId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),

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
  file14Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file14ExpiryDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
  file8Path: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  file8ExpiryDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
})

export const xrayRefinement = (data: any, ctx: z.RefinementCtx) => {
  if (data.identity && data.identity.length === 14) {
    if (!data.birthDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Majburiy maydon!',
        path: ['birthDate'],
      })
    }
  }
}

const __RegisterIllegalXraySchema = RegisterIllegalXrayBaseSchema.superRefine(xrayRefinement)

export type RegisterIllegalXrayDTO = z.infer<typeof RegisterIllegalXraySchema>

export const RegisterIllegalXraySchema = __RegisterIllegalXraySchema
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file7Path', 'file7ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file9Path', 'file9ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file14Path', 'file14ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file8Path', 'file8ExpiryDate'))
