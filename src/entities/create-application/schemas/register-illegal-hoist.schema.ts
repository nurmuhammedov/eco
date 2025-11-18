import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const HoistIllegalAppealDtoSchema = z
  .object({
    phoneNumber: z
      .string({ message: FORM_ERROR_MESSAGES.required })
      .trim()
      .refine((val) => USER_PATTERNS.phone.test(val), {
        message: FORM_ERROR_MESSAGES.phone,
      }),
    identity: z
      .string({ required_error: 'STIR yoki JSHSHIR kiritilishi shart' })
      .min(9, 'STIR 9 xonali bo‘lishi kerak')
      .max(14, 'JSHSHIR 14 xonali bo‘lishi kerak')
      .regex(/^\d+$/, 'Faqat raqamlar kiritilishi kerak'),
    birthDate: z
      .date()
      .optional()
      .transform((date) => (date ? format(date, 'yyyy-MM-dd') : null)),
    hazardousFacilityId: z.string().uuid('XICHO ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy
    childEquipmentId: z
      .string({
        required_error: 'Yuk ko‘targich turini tanlanmadi!',
      })
      .min(1, 'Yuk ko‘targich turini tanlanmadi!'),
    factoryNumber: z.string().optional(),
    regionId: z
      .string({
        required_error: 'Yuk ko‘targich joylashgan viloyat tanlanmadi!',
      })
      .min(1, 'Yuk ko‘targich joylashgan viloyat tanlanmadi!'),
    districtId: z
      .string({
        required_error: 'Yuk ko‘targich joylashgan tuman tanlanmadi!',
      })
      .min(1, 'Yuk ko‘targich joylashgan tuman tanlanmadi!'),
    address: z
      .string({
        required_error: 'Yuk ko‘targich joylashgan manzil kiritilmadi!',
      })
      .min(1, 'Yuk ko‘targich joylashgan manzil kiritilmadi!'),
    model: z.string().optional(),
    factory: z.string().optional(),
    location: z
      .string({
        required_error: 'Joylashuv tanlanmadi!',
      })
      .min(1, 'Joylashuv tanlanmadi!'),
    manufacturedAt: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    partialCheckDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    fullCheckDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    labelPath: z.string().optional(),
    labelExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    saleContractPath: z.string().optional(),
    saleContractExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    equipmentCertPath: z.string().optional(),
    equipmentCertExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    assignmentDecreePath: z.string().optional(),
    assignmentDecreeExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    expertisePath: z.string().optional(),
    expertiseExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    installationCertPath: z.string().optional(),
    installationCertExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    additionalFilePath: z.string().optional(), // Ixtiyoriy
    additionalFileExpiryDate: z
      .date()
      .optional()
      .transform((date) => date && format(date, 'yyyy-MM-dd')),
    height: z.string().optional(),
    liftingCapacity: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.identity && data.identity.length === 14) {
      if (!data.birthDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tug‘ilgan sana kiritilishi shart',
          path: ['birthDate'],
        });
      }
    }
  });
