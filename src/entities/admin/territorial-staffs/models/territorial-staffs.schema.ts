import { z } from 'zod';
import { UserRoles } from '@/entities/user';
import { USER_PATTERNS } from '@/shared/constants/custom-patterns';

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

export const territorialBaseSchema = {
  fullName: z.string({ message: ERROR_MESSAGES.fio }).min(1, ERROR_MESSAGES.required),
  position: z
    .string({ message: ERROR_MESSAGES.position })

    .min(1, ERROR_MESSAGES.required),
  pin: z.coerce
    .string({ message: ERROR_MESSAGES.pin })
    .transform((val) => val.toString())
    .refine((val) => USER_PATTERNS.pin.test(val), {
      message: ERROR_MESSAGES.pin,
    }),
  role: z.nativeEnum(UserRoles, {
    errorMap: () => ({ message: ERROR_MESSAGES.role }),
  }),

  directions: z.preprocess(
    // Convert empty arrays or null/undefined to undefined for proper validation
    (val) => (Array.isArray(val) && val.length > 0 ? val : undefined),
    z.array(z.string().trim()).min(1, ERROR_MESSAGES.direction).default([]),
  ),
  officeId: z.string().min(1, ERROR_MESSAGES.department),
  phoneNumber: z
    .string({ message: ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: ERROR_MESSAGES.phone,
    }),
};

export const territorialStaffSchema = z
  .object({
    id: z.string().optional(),
    ...territorialBaseSchema,
  })
  .strict() // Prevents additional properties
  .transform((data) => ({
    ...data,
    // Ensure consistent formatting of phone numbers
    phoneNumber: data.phoneNumber.startsWith('+') ? data.phoneNumber : `+${data.phoneNumber}`,
    // Additional data cleanup if needed
    fullName: data.fullName.replace(/\s+/g, ' '),
  }));

export const territorialTableItemSchema = z.object({
  id: z.union([z.string().uuid(), z.string().regex(USER_PATTERNS.uuid, { message: 'Invalid UUID format' })]),

  fullName: z.string().trim().min(1),
  pin: z.union([
    z.number().transform((val) => val.toString()),
    z.string().regex(/^\d+$/, { message: ERROR_MESSAGES.pin }),
  ]),
  role: z.nativeEnum(UserRoles),
  directions: z.array(z.string()).default([]),
  office: z.string(),
  officeId: z.union([z.number().int().positive(), z.string().transform((val) => parseInt(val))]),
  position: z.string(),
  phoneNumber: z.string().regex(USER_PATTERNS.phone, { message: ERROR_MESSAGES.phone }),
  enabled: z.boolean().default(true),
});

export const schemas = {
  create: z.object(territorialBaseSchema),
  update: z.object({
    id: z.string(),
    ...Object.fromEntries(Object.entries(territorialBaseSchema).map(([k, validator]) => [k, validator.optional()])),
  }),
  filter: z.object({
    ...Object.fromEntries(Object.entries(territorialBaseSchema).map(([k, validator]) => [k, validator.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  table: territorialTableItemSchema,
  single: territorialTableItemSchema,
};
