import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { checkExpiryDate } from '@/shared/lib/zod-helpers'
import { format } from 'date-fns'
import { z } from 'zod'

export const RegisterIllegalIrsBaseSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  identity: z
    .string()
    .regex(/^\d+$/)
    .refine((val) => val.length === 9 || val.length === 14, {
      message: FORM_ERROR_MESSAGES.invalid,
    }),
  birthDate: z
    .date()
    .optional()
    .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),

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
  regionId: z.string().trim().min(1),
  districtId: z.string().trim().min(1),
  address: z.string().trim().min(1),
})

export const irsRefinement = (data: any, ctx: z.RefinementCtx) => {
  if (data.identity && data.identity.length === 14) {
    if (!data.birthDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: FORM_ERROR_MESSAGES.required,
        path: ['birthDate'],
      })
    }
  }
}

export const RegisterIllegalIrsSchema = RegisterIllegalIrsBaseSchema.superRefine(irsRefinement)
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file1Path', 'file1ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file2Path', 'file2ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file5Path', 'file5ExpiryDate'))
  .superRefine((data: any, ctx: any) => checkExpiryDate(data, ctx, 'file15Path', 'file15ExpiryDate'))

export type RegisterIllegalIrsDTO = z.infer<typeof RegisterIllegalIrsSchema>
