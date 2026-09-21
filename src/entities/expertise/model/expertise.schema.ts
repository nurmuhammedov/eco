import { z } from 'zod'
import { ExpertiseTypeEnum } from './constants'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'

export const addOldExpertiseSchema = z.object({
  customerTin: z.string().length(9),
  customerPhoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), { message: FORM_ERROR_MESSAGES.invalid }),
  hfId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null))
    .nullable(),
  type: z.nativeEnum(ExpertiseTypeEnum),
  objectName: z.string().min(1),
  regionId: z.string(),
  districtId: z.string(),
  expertiseName: z.string().min(1).max(500),
  address: z.string().min(1),
  conclusionFilePath: z.string().min(1),
  declarationFilePath: z.string().min(1),
  calculationLetterPath: z.string().min(1),
  informationNotePath: z.string().min(1),
  conclusionRegistryNumber: z.string().min(1),
  declarationRegistryNumber: z.string().min(1),
  declarationRegistrationDate: z.date(),
  conclusionRegistrationDate: z.date(),
})

export const addExpertiseSchema = z
  .object({
    customerTin: z.string().length(9),
    customerPhoneNumber: z
      .string({ message: FORM_ERROR_MESSAGES.required })
      .trim()
      .refine((val) => USER_PATTERNS.phone.test(val), {
        message: FORM_ERROR_MESSAGES.invalid,
      }),
    hfId: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? val : null))
      .nullable(),

    type: z.nativeEnum(ExpertiseTypeEnum),
    objectName: z.string().min(1),
    regionId: z.string(),
    districtId: z.string(),
    expertiseName: z.string().min(1).max(500),
    address: z.string().min(1),
    declarationFilePath: z.string().optional(),
    calculationLetterPath: z.string().optional(),
    informationNotePath: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === ExpertiseTypeEnum.XD) {
      if (!data.declarationFilePath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['declarationFilePath'],
          message: FORM_ERROR_MESSAGES.required,
        })
      }
      if (!data.calculationLetterPath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['calculationLetterPath'],
          message: FORM_ERROR_MESSAGES.required,
        })
      }
      if (!data.informationNotePath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['informationNotePath'],
          message: FORM_ERROR_MESSAGES.required,
        })
      }
    }
  })
