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
  birthDateRequired: 'Tug‘ilgan sana kiritilishi shart!', // Tug'ilgan sana uchun xabar
} as const;

// Bu o'zgarmadi, `birthDate` majburiy emas
export const committeeBaseSchema = {
  fullName: z.string({ message: ERROR_MESSAGES.fio }).min(1, ERROR_MESSAGES.required),
  position: z.string({ message: ERROR_MESSAGES.position }).min(1, ERROR_MESSAGES.required),
  birthDate: z.date().optional().nullable(),
  pin: z.coerce
    .number({ message: ERROR_MESSAGES.pin })
    .transform((val) => val.toString())
    .refine((val) => USER_PATTERNS.pin.test(val), { message: ERROR_MESSAGES.pin }),
  role: z.nativeEnum(UserRoles, {
    errorMap: () => ({ message: ERROR_MESSAGES.role }),
  }),
  directions: z.preprocess(
    (val) => (Array.isArray(val) && val.length > 0 ? val : undefined),
    z.array(z.string().trim()).min(1, ERROR_MESSAGES.direction).default([]),
  ),
  departmentId: z.string().min(1, ERROR_MESSAGES.department),
  phoneNumber: z
    .string({ message: ERROR_MESSAGES.required })
    .trim()
    .refine((val) => USER_PATTERNS.phone.test(val), {
      message: ERROR_MESSAGES.phone,
    }),
};

// ... bu qism o'zgarmadi ...
export const committeeStaffSchema = z
  .object({
    id: z.string().optional(),
    ...committeeBaseSchema,
  })
  .strict()
  .transform((data) => ({
    ...data,
    phoneNumber: data.phoneNumber.startsWith('+') ? data.phoneNumber : `+${data.phoneNumber}`,
    fullName: data.fullName.replace(/\s+/g, ' '),
  }));

export const committeeTableItemSchema = z.object({
  id: z.union([z.string().uuid(), z.string().regex(USER_PATTERNS.uuid, { message: 'Invalid UUID format' })]),
  fullName: z.string().trim().min(1),
  pin: z.union([
    z.number().transform((val) => val.toString()),
    z.string().regex(/^\d+$/, { message: ERROR_MESSAGES.pin }),
  ]),
  role: z.nativeEnum(UserRoles),
  directions: z.array(z.string()).default([]),
  department: z.string(),
  birthDate: z.date({ required_error: 'Sana majburiy' }), // Jadvalda sana majburiy bo'lishi mumkin
  departmentId: z.union([z.number().int().positive(), z.string().transform((val) => parseInt(val))]),
  position: z.string(),
  phoneNumber: z.string().regex(USER_PATTERNS.phone, { message: ERROR_MESSAGES.phone }),
  enabled: z.boolean().default(true),
});

export const schemas = {
  // Yaratish rejimida: `committeeBaseSchema` ni olamiz va `birthDate` ni majburiy qilamiz
  create: z.object({
    ...committeeBaseSchema,
    birthDate: z.date({ required_error: 'Tug‘ilgan sana kiritilishi shart!' }),
  }),
  update: z.object({
    id: z.string().optional(),
    fullName: committeeBaseSchema.fullName.optional(),
    position: committeeBaseSchema.position.optional(),
    birthDate: committeeBaseSchema.birthDate.optional(),
    pin: committeeBaseSchema.pin.optional(),
    role: committeeBaseSchema.role.optional(),
    directions: committeeBaseSchema.directions.optional(),
    departmentId: committeeBaseSchema.departmentId.optional(),
    phoneNumber: committeeBaseSchema.phoneNumber.optional(),
  }),

  // Filter sxemasi o'zgarmadi
  filter: z.object({
    ...Object.fromEntries(Object.entries(committeeBaseSchema).map(([key, validator]) => [key, validator.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),

  table: committeeTableItemSchema,
  single: committeeTableItemSchema,
};

export type CreateCommitteeStaffDTO = z.infer<typeof schemas.create>;
export type UpdateCommitteeStaffDTO = z.infer<typeof schemas.update>;
