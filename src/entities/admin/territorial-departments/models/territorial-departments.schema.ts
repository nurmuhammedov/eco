import { z } from 'zod';

export const territorialDepartmentsBaseSchema = {
  name: z.string().min(1, 'Nomi majburiy'),
  regionIds: z.array(z.number().int().positive()),
};

export const territorialDepartmentsSchema = z.object({
  id: z.number().optional(),
  ...territorialDepartmentsBaseSchema,
});

export const schemas = {
  create: z.object(territorialDepartmentsBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(territorialDepartmentsBaseSchema).map(([k, validator]) => [k, validator.optional()]),
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(territorialDepartmentsBaseSchema).map(([k, validator]) => [k, validator.optional()]),
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: territorialDepartmentsSchema,
};
