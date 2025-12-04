import { z } from 'zod'

export const centralApparatusBaseSchema = {
  name: z.string().min(1, 'Viloyat nomi majburiy'),
}

export const centralApparatusSchema = z.object({
  id: z.number().optional(),
  ...centralApparatusBaseSchema,
})

export const schemas = {
  create: z.object(centralApparatusBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(centralApparatusBaseSchema).map(([k, validator]) => [k, validator.optional()])
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(centralApparatusBaseSchema).map(([k, validator]) => [k, validator.optional()])
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: centralApparatusSchema,
}
