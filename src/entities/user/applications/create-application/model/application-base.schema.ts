import { z } from 'zod';

export const emailMessage = 'Яроқсиз почта манзили';
export const defaultRequiredMessage = { message: 'Мажбурий майдон' };

export const ApplicationBaseSchema = z.object({
  phone: z
    .string(defaultRequiredMessage)
    .trim()
    .refine((value) => /^(\+998\d{9})$/.test(value), {
      message: 'Телефон рақами нотўғри',
    }),
  email: z.string(defaultRequiredMessage).email(emailMessage),
  application_type: z.string(defaultRequiredMessage),
});
