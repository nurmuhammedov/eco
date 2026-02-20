import { IrsCategory, IrsIdentifierType, IrsUsageType } from '@/entities/create-application/types/enums'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { format } from 'date-fns'
import { z } from 'zod'

export const RegisterIllegalIrsBaseSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Majburiy maydon!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  identity: z
    .string({ required_error: 'Majburiy maydon!' })
    .regex(/^\d+$/, 'Faqat raqamlar bo‘lishi kerak')
    .refine((val) => val.length === 9 || val.length === 14, {
      message: 'STIR 9 yoki JSHSHIR 14 xonadan iborat bo‘lishi kerak',
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
  passportPath: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  additionalFilePath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  regionId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  districtId: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
  address: z.string({ required_error: 'Majburiy maydon!' }).trim().min(1, 'Majburiy maydon!'),
})

export const irsRefinement = (data: any, ctx: z.RefinementCtx) => {
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

export const RegisterIllegalIrsSchema = RegisterIllegalIrsBaseSchema.superRefine(irsRefinement)

export type RegisterIllegalIrsDTO = z.infer<typeof RegisterIllegalIrsSchema>
