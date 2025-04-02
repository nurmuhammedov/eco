import { z } from 'zod';

export const committeeBaseSchema = {
  name: z.string().min(1, 'Viloyat nomi majburiy'),
};

export const committeeStaffSchema = z.object({
  id: z.number().optional(),
  ...committeeBaseSchema,
});

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
