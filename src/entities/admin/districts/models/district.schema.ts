import { z } from 'zod';

export const districtBaseSchema = {
  name: z.string().min(1, 'Viloyat nomi majburiy'),
  soato: z.coerce.number().min(1, 'МҲОБТni kiritish majburiy'),
  number: z.coerce.number().min(1, 'Raqamni kiritish majburiy'),
  regionId: z.coerce.number().min(1, 'Raqamni kiritish majburiy').nullable(),
};

export const districtSchema = z.object({
  id: z.number().optional(),
  ...districtBaseSchema,
});

export const schemas = {
  create: z.object(districtBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(districtBaseSchema).map(([k, validator]) => [
        k,
        validator.optional(),
      ]),
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(districtBaseSchema).map(([k, validator]) => [
        k,
        validator.optional(),
      ]),
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: districtSchema,
};
