import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .refine((value) => /^(\+998\d{9})$/.test(value), {
    message: "Telefon raqami noto'g'ri!",
  });
