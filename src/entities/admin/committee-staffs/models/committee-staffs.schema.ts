import { z } from 'zod';
import { UserRoles } from '@/entities/user';

const PATTERNS = { pin: /^\d{14}$/, phoneUz: /^\+998\d{9}$/ } as const;

const ERROR_MESSAGES = {
  required: "Bu maydonni to'ldirish majburiy",
  fio: 'FIO ni kiritish majburiy',
  position: 'Lavozimni tanlash majburiy',
  pin: "JSHSHIR 14 ta raqamdan iborat bo'lishi kerak",
  role: 'Rolni tanlash majburiy',
  direction: "Kamida bitta yo'nalish tanlash majburiy",
  department: "Bo'limni tanlash majburiy",
  phone: "Telefon raqami formati +998XXXXXXXXX bo'lishi kerak",
} as const;

export const committeeBaseSchema = {
  fullName: z
    .string({ message: ERROR_MESSAGES.fio })
    .min(1, ERROR_MESSAGES.required),
  position: z
    .string({ message: ERROR_MESSAGES.position })

    .min(1, ERROR_MESSAGES.required),
  pin: z.coerce
    .number({ message: ERROR_MESSAGES.pin })
    .transform((val) => val.toString())
    .refine((val) => PATTERNS.pin.test(val), { message: ERROR_MESSAGES.pin }),
  role: z.nativeEnum(UserRoles, {
    errorMap: () => ({ message: ERROR_MESSAGES.role }),
  }),

  directions: z.preprocess(
    // Convert empty arrays or null/undefined to undefined for proper validation
    (val) => (Array.isArray(val) && val.length > 0 ? val : undefined),
    z.array(z.string().trim()).min(1, ERROR_MESSAGES.direction).default([]),
  ),
  departmentId: z.string().min(1, ERROR_MESSAGES.department),
  phoneNumber: z
    .string({ message: ERROR_MESSAGES.required })
    .trim()
    .refine((val) => PATTERNS.phoneUz.test(val), {
      message: ERROR_MESSAGES.phone,
    }),
};

export const committeeStaffSchema = z
  .object({
    id: z.number().optional(),
    ...committeeBaseSchema,
  })
  .strict() // Prevents additional properties
  .transform((data) => ({
    ...data,
    // Ensure consistent formatting of phone numbers
    phoneNumber: data.phoneNumber.startsWith('+')
      ? data.phoneNumber
      : `+${data.phoneNumber}`,
    // Additional data cleanup if needed
    fullName: data.fullName.replace(/\s+/g, ' '),
  }));

export const schemas = {
  create: z.object(committeeBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(committeeBaseSchema).map(([k, validator]) => [
        k,
        validator.optional(),
      ]),
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(committeeBaseSchema).map(([k, validator]) => [
        k,
        validator.optional(),
      ]),
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: committeeStaffSchema,
};
