import { HFSphere } from '@/shared/types';
import { z } from 'zod';

const HFSphereEnum = z.enum(HFSphere);

export const HFAppealDtoSchema = z.object({
  // Required fields with custom error messages
  phoneNumber: z
    .string({
      required_error: 'Telefon raqami kiritilmadi!',
    })
    .min(1, 'Telefon raqami kiritilmadi!'),

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

  hazardousFacilityTypeId: z.string({
    required_error: 'XICHO turi tanlanmadi!',
  }),

  regionId: z.string({
    required_error: 'Viloyat tanlanmadi!',
  }),

  districtId: z.string({
    required_error: 'Tuman tanlanmadi!',
  }),

  identificationCardPath: z
    .string({
      required_error: "Identifikatsiya varag'i fayli biriktirilmadi!",
    })
    .min(1, "Identifikatsiya varag'i fayli biriktirilmadi!"),

  receiptPath: z
    .string({
      required_error: "XICHOni ro'yxatga olish uchun to'lov kvitansiyasi fayli biriktirilmadi!",
    })
    .min(1, "XICHOni ro'yxatga olish uchun to'lov kvitansiyasi fayli biriktirilmadi!"),

  // Optional fields
  upperOrganization: z.string(),
  name: z.string().optional(),
  extraArea: z.string().optional(),
  description: z.string().optional(),

  // Array field
  spheres: z.array(HFSphereEnum),

  // Optional file paths
  expertOpinionPath: z.string(),
  projectDocumentationPath: z.string(),
  cadastralPassportPath: z.string(),
  industrialSafetyDeclarationPath: z.string(),
  insurancePolicyPath: z.string(),
  licensePath: z.string(),
  permitPath: z.string(),
  certificationPath: z.string(),
  deviceTestingPath: z.string(),
  appointmentOrderPath: z.string(),
  ecologicalConclusionPath: z.string(),
  replyLetterPath: z.string(),
});
