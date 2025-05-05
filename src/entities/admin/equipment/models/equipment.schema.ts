import { z } from 'zod';

export const equipmentBaseSchema = {
  name: z.string().min(1, 'Tuman nomi majburiy'),
  equipmentType: z.string().min(1, 'Viloyatni tanlash majburiy'),
};

export const equipmentSchema = z.object({
  id: z.number().optional(),
  ...equipmentBaseSchema,
});

export const schemas = {
  create: z.object(equipmentBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(Object.entries(equipmentBaseSchema).map(([k, validator]) => [k, validator.optional()])),
  }),
  filter: z.object({
    ...Object.fromEntries(Object.entries(equipmentBaseSchema).map(([k, validator]) => [k, validator.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: equipmentSchema,
};
