import { z } from 'zod';

export const regionBaseSchema = {
  name: z.string().min(1, 'Viloyat nomi majburiy'),
  soato: z.coerce.number().min(1, 'МҲОБТni kiritish majburiy'),
  number: z.coerce.number().min(1, 'Raqamni kiritish majburiy'),
};

export const regionSchema = z.object({
  id: z.number().optional(),
  ...regionBaseSchema,
});

export const schemas = {
  create: z.object(regionBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(regionBaseSchema).map(([k, validator]) => [
        k,
        validator.optional(),
      ]),
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(regionBaseSchema).map(([k, validator]) => [
        k,
        validator.optional(),
      ]),
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: regionSchema,
};
