import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const CadastrePassportAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hfId: z.string().min(1, { message: FORM_ERROR_MESSAGES.required }),
  hfName: z.string().min(1, 'XICHO nomi kiritilishi majburiy'),
  regionId: z.string().min(1, { message: 'Viloyatni tanlash majburiy' }),
  districtId: z.string().min(1, { message: 'Tumanni tanlash majburiy' }),
  address: z.string().min(1, { message: 'Manzilni kiritish majburiy' }),
  organizationTin: z.string().length(9, { message: 'STIR 9 ta raqamdan iborat bo‘lishi kerak' }),
  organizationName: z.string().min(1, { message: 'Tashkilot nomini kiritish majburiy' }),
  organizationAddress: z.string().min(1, { message: 'Tashkilot manzilini kiritish majburiy' }),
  location: z.string().min(1, { message: 'Lokatsiyani tanlash majburiy' }),
  passportPath: z.string().min(1, { message: 'Pasport faylini yuklash majburiy' }),
  agreementPath: z.string().min(1, { message: "Kelishuv varag'i faylini yuklash majburiy" }),
});
