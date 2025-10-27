// src/entities/create-application/schemas/register-lpg-container.schema.ts
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';
import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { format } from 'date-fns';
import { z } from 'zod';

export const LpgContainerIllegalAppealDtoSchema = z.object({
  phoneNumber: z
    .string({ message: FORM_ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: FORM_ERROR_MESSAGES.phone,
    }),
  hazardousFacilityId: z.string().uuid('XICHO‘ ID noto‘g‘ri formatda!').optional().or(z.literal('')), // Ixtiyoriy,
  identity: z.string().min(9, "STIR 9 ta raqamdan iborat bo'lishi kerak"),
  birthDate: z.coerce // <-- "coerce" qo'shiladi
    .date({
      // Agar sana noto'g'ri formatda bo'lsa, maxsus xabar chiqarish uchun:
      errorMap: () => ({ message: "Iltimos, to'g'ri sanani kiriting" }),
    })
    .optional()
    .transform((date) => {
      // Bu qism o'zgarishsiz qoladi, u serverga yuborishdan oldin formatlash uchun kerak
      if (date) {
        return format(date, 'yyyy-MM-dd');
      }
      return date;
    }),
  childEquipmentId: z
    .string({
      required_error: 'Idish (SUG) turini tanlanmadi!',
    })
    .min(1, 'Idish (SUG) turini tanlanmadi!'),
  factoryNumber: z.string().optional(),
  regionId: z
    .string({
      required_error: 'Idish (SUG) joylashgan viloyat tanlanmadi!',
    })
    .min(1, 'Idish (SUG) joylashgan viloyat tanlanmadi!'),
  districtId: z
    .string({
      required_error: 'Idish (SUG) joylashgan tuman tanlanmadi!',
    })
    .min(1, 'Idish (SUG) joylashgan tuman tanlanmadi!'),
  address: z
    .string({
      required_error: 'Idish (SUG) joylashgan manzil kiritilmadi!',
    })
    .min(1, 'Idish (SUG) joylashgan manzil kiritilmadi!'),
  model: z.string({ required_error: 'Model, marka kiritilmadi!' }).min(1, 'Model, marka kiritilmadi!'),
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
  nonDestructiveCheckDate: z
    .date()
    .optional()
    .transform((date) => date && format(date, 'yyyy-MM-dd')),
  capacity: z.string().optional(),
  environment: z.string().optional(),
  pressure: z.string().optional(),
});
