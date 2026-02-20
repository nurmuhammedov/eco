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

export const RegisterIllegalXraySchema = RegisterIllegalXrayBaseSchema.superRefine(xrayRefinement)

export type RegisterIllegalXrayDTO = z.infer<typeof RegisterIllegalXraySchema>
