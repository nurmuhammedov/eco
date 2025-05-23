import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { HFSphere } from '@/shared/types';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]]);

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
    .min(1, 'Manzil kiritilmadi!'),
  hfTypeId: z.string({
    required_error: 'XICHO turi tanlanmadi!',
  }),
  regionId: z.string({
    required_error: 'Viloyat tanlanmadi!',
  }),
  districtId: z.string({
    required_error: 'Tuman tanlanmadi!',
  }),
  upperOrganization: z.string().optional(),
  name: z.string({ required_error: 'XICHO ning nomi kiritilmadi!' }),
  extraArea: z.string({ required_error: 'Maydon kiritilmadi!' }).min(1, 'Maydon kiritilmadi!'),
  hazardousSubstance: z.string({ required_error: 'Maydon kiritilmadi!' }).min(1, 'Maydon kiritilmadi!'),
  spheres: z.array(HFSphereEnum, { required_error: 'Tarmoqlar tanlanmadi!' }),
  identificationCardPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  receiptPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  expertOpinionPath: z.string().optional(),
  projectDocumentationPath: z.string().optional(),
  cadastralPassportPath: z.string().optional(),
  industrialSafetyDeclarationPath: z.string().optional(),
  insurancePolicyPath: z.string().optional(),
  licensePath: z.string().optional(),
  permitPath: z.string().optional(),
  certificationPath: z.string().optional(),
  deviceTestingPath: z.string().optional(),
  appointmentOrderPath: z.string().optional(),
  ecologicalConclusionPath: z.string().optional(),
  replyLetterPath: z.string().optional(),
});
