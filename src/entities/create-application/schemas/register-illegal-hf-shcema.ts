import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { HFSphere } from '@/shared/types';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const HFSphereEnum = z.enum(Object.values(HFSphere) as [string, ...string[]]);

export const RegisterIllegalHFSchema = z.object({
  phoneNumber: z
    .string({ required_error: 'Telefon raqam kiritilmadi!' })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),

  legalTin: z.string({ required_error: 'STIR kiritilmadi!' }).min(1, 'STIR kiritilmadi!'),

  name: z.string({ required_error: 'XICHO ning nomi kiritilmadi!' }).min(1, 'XICHO ning nomi kiritilmadi!'),

  address: z.string({ required_error: 'Manzil kiritilmadi!' }).min(1, 'Manzil kiritilmadi!'),

  regionId: z.string({ required_error: 'Viloyat tanlanmadi!' }).min(1, 'Viloyat tanlanmadi!'),

  districtId: z.string({ required_error: 'Tuman tanlanmadi!' }).min(1, 'Tuman tanlanmadi!'),

  location: z.string({ required_error: 'Koordinatalar kiritilmadi!' }).min(1, 'Koordinatalar kiritilmadi!'),

  upperOrganization: z.string().optional(),
  hfTypeId: z.string().optional(),
  hfTypeName: z.string().optional(),
  extraArea: z.string().optional(),
  hazardousSubstance: z.string().optional(),
  spheres: z.array(HFSphereEnum).optional(),
  identificationCardPath: z.string().optional(),
  receiptPath: z.string().optional(),
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
  fireSafetyConclusionPath: z.string().optional(),
  replyLetterPath: z.string().optional(),
  filesBuilt: z.boolean().optional(),
});
