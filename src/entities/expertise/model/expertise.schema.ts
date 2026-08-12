import { z } from 'zod'
import { ExpertiseTypeEnum } from './constants'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'
import { USER_PATTERNS } from '@/shared/constants/custom-patterns'

export const addOldExpertiseSchema = z.object({
  customerTin: z.string({ required_error: 'STIR kiritilmadi!' }).length(9, 'STIR 9 ta raqamdan iborat bo‘lishi kerak'),
  customerPhoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), { message: FORM_ERROR_MESSAGES.phone }),
  hfId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null))
    .nullable(),
  type: z.nativeEnum(ExpertiseTypeEnum, { required_error: 'Ekspertiza turini tanlang' }),
  objectName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  regionId: z.string({ required_error: 'Viloyatni tanlang!' }),
  districtId: z.string({ required_error: 'Tumanni tanlang!' }),
  expertiseName: z
    .string({ required_error: 'Majburiy maydon!' })
    .min(1, 'Majburiy maydon!')
    .max(500, { message: 'Obyekt nomi 500 belgidan oshmasligi kerak' }),
  address: z.string({ required_error: 'Manzil kiritilmadi!' }).min(1, 'Manzil kiritilmadi!'),
  conclusionFilePath: z.string({ required_error: 'Fayl yuklash majburiy' }).min(1, 'Fayl yuklash majburiy'),
  declarationFilePath: z.string({ required_error: 'Fayl yuklash majburiy' }).min(1, 'Fayl yuklash majburiy'),
  calculationLetterPath: z.string({ required_error: 'Fayl yuklash majburiy' }).min(1, 'Fayl yuklash majburiy'),
  informationNotePath: z.string({ required_error: 'Fayl yuklash majburiy' }).min(1, 'Fayl yuklash majburiy'),
  conclusionRegistryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  declarationRegistryNumber: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  declarationRegistrationDate: z.date({ required_error: 'Sana kiritish majburiy!' }),
  conclusionRegistrationDate: z.date({ required_error: 'Sana kiritish majburiy!' }),
})

export const addExpertiseSchema = z
  .object({
    customerTin: z
      .string({
        required_error: 'STIR  kiritilmadi!',
      })
      .length(9, 'STIR 9 ta raqamdan iborat bo‘lishi kerak'),
    customerPhoneNumber: z
      .string({ message: FORM_ERROR_MESSAGES.required })
      .trim()
      .refine((val) => USER_PATTERNS.phone.test(val), {
        message: FORM_ERROR_MESSAGES.phone,
      }),
    hfId: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? val : null))
      .nullable(),

    type: z.nativeEnum(ExpertiseTypeEnum, {
      required_error: 'Ekspertiza turini tanlang',
    }),
    objectName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
    regionId: z.string({ required_error: 'Viloyatni tanlang!' }),
    districtId: z.string({ required_error: 'Tumanni tanlang!' }),
    expertiseName: z
      .string({ required_error: 'Majburiy maydon!' })
      .min(1, 'Majburiy maydon!')
      .max(500, { message: 'Obyekt nomi 500 belgidan oshmasligi kerak' }),
    address: z.string({ required_error: 'Manzil kiritilmadi!' }).min(1, 'Manzil kiritilmadi!'),
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
          message: 'Deklaratsiya faylini yuklash majburiy',
        })
      }
      if (!data.calculationLetterPath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['calculationLetterPath'],
          message: 'Hisob-kitob tushuntirish xatini yuklash majburiy',
        })
      }
      if (!data.informationNotePath) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['informationNotePath'],
          message: 'Axborotnomani yuklash majburiy',
        })
      }
    }
  })
