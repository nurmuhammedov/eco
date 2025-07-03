import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const DeclarationAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hfId: z.string().min(1, 'XICHOning ro‘yxatga olingan raqami kiritilishi shart'),
  hfName: z.string().min(1, 'XICHO nomi kiritilishi shart'),
  hfRegistryNumber: z.string().min(1, 'Deklaratsiya ro‘yxat raqami kiritilishi shart'),
  address: z.string().min(1, 'Obyekt manzili kiritilishi shart'),
  regionId: z.string().min(1, 'Viloyat tanlanishi shart'),
  districtId: z.string().min(1, 'Tuman tanlanishi shart'),
  information: z.string().min(1, 'Obyekt haqida maʼlumot kiritilishi shart'),
  producingOrganizationTin: z.string().length(9, { message: 'STIR 9 ta raqamdan iborat bo‘lishi kerak' }),
  producingOrganizationName: z.string().min(1, 'Deklaratsiyani ishlab chiqqan tashkilot nomi kiritilishi shart'),
  operatingOrganizationName: z.string().min(1, 'Obyektni ishlatayotgan tashkilot nomi kiritilishi shart'),
  expertiseNumber: z.string().min(1, 'Ekspertiza raqami kiritilishi shart'),
  expertiseDate: z
    .date({ required_error: 'Ekspertiza sanasi kiritilishi shart' })
    .transform((date) => format(date, 'yyyy-MM-dd')),
  registrationOrganizationName: z.string().min(1, 'Roʻyxatga olgan tashkilot nomi kiritilishi shart'),
  declarationPath: z.string().min(1, 'Deklaratsiya titul varag‘i fayli biriktirilishi shart'),
  agreementPath: z.string().min(1, 'Kelishuv titul varag‘i fayli biriktirilishi shart'),
});
