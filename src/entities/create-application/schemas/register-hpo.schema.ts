import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { HFSphere } from '@/shared/types';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]]);

export const HFAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  address: z
    .string({
      required_error: 'Manzil kiritilmadi!',
    })
    .min(1, 'Manzil kiritilmadi!'),
  location: z
    .string({
      required_error: 'Koordinatalar kiritilmadi!',
    })
    .min(1, 'Koordinatalar kiritilmadi!'),
  hfTypeId: z
    .string({
      required_error: 'XICHO turi tanlanmadi!',
    })
    .min(1, 'XICHO turi tanlanmadi!'),
  regionId: z
    .string({
      required_error: 'Viloyat tanlanmadi!',
    })
    .min(1, 'Viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Tuman tanlanmadi!',
    })
    .min(1, 'Tuman tanlanmadi!'),
  upperOrganization: z.string().optional(),
  name: z.string({ required_error: 'XICHO ning nomi kiritilmadi!' }).min(1, 'XICHO ning nomi kiritilmadi!'),
  extraArea: z.string({ required_error: 'Maydon kiritilmadi!' }).min(1, 'Maydon kiritilmadi!'),
  hazardousSubstance: z.string({ required_error: 'Maydon kiritilmadi!' }).min(1, 'Maydon kiritilmadi!'),
  spheres: z.array(HFSphereEnum, { required_error: 'Tarmoqlar tanlanmadi!' }).min(1, 'Tarmoqlar tanlanmadi!'),
  identificationCardPath: z
    .string({ required_error: 'Identifikatsiya varag‘i fayli biriktirilmadi!' })
    .min(1, 'Identifikatsiya varag‘i fayli biriktirilmadi!'),
  receiptPath: z
    .string({ required_error: 'XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi fayli biriktirilmadi!' })
    .min(1, 'XICHOni ro‘yxatga olish uchun to‘lov kvitansiyasi fayli biriktirilmadi!'),
  expertOpinionPath: z.string().optional(),
  expertOpinionExpiryDate: z.date().optional(),
  projectDocumentationPath: z.string().optional(),
  projectDocumentationExpiryDate: z.string().optional(),
  cadastralPassportPath: z.string().optional(),
  cadastralPassportExpiryDate: z.date().optional(),
  industrialSafetyDeclarationPath: z.string().optional(),
  industrialSafetyDeclarationExpiryDate: z.date().optional(),
  insurancePolicyPath: z.string().optional(),
  insurancePolicyExpiryDate: z.date().optional(),
  licensePath: z.string().optional(),
  licenseExpiryDate: z.date().optional(),
  permitPath: z.string().optional(),
  permitExpiryDate: z.date().optional(),
  certificationPath: z.string().optional(),
  certificationExpiryDate: z.date().optional(),
  deviceTestingPath: z.string().optional(),
  deviceTestingExpiryDate: z.date().optional(),
  appointmentOrderPath: z.date().optional(),
  appointmentOrderExpiryDate: z.string().optional(),
  ecologicalConclusionPath: z.string().optional(),
  ecologicalConclusionExpiryDate: z.date().optional(),
  replyLetterPath: z.string().optional(),
});
