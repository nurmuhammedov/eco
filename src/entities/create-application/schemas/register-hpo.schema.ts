import { z } from 'zod';
import { HFSphere } from '@/shared/types';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';

const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]]);

export const HFAppealDtoSchema = z.object({
  // Required fields with custom error messages
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

  // Array field
  spheres: z.array(HFSphereEnum, { required_error: 'Tarmoqlar tanlanmadi!' }),

  // File fields
  identificationCardPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  receiptPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  expertOpinionPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  projectDocumentationPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  cadastralPassportPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  industrialSafetyDeclarationPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  insurancePolicyPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  licensePath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  permitPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  certificationPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  deviceTestingPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  appointmentOrderPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  ecologicalConclusionPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
  replyLetterPath: z.string({ required_error: 'Fayl biriktirilmadi!' }),
});
