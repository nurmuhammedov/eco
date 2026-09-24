import { z } from 'zod'

export const categoryTypeBaseSchema = {
  category: z.string().min(1),
  type: z.string().min(1),
}

export const categoryTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  ...categoryTypeBaseSchema,
})

export const categoryTypeSchemas = {
  create: z.object(categoryTypeBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(Object.entries(categoryTypeBaseSchema).map(([k, v]) => [k, v.optional()])),
  }),
  filter: z.object({
    ...Object.fromEntries(Object.entries(categoryTypeBaseSchema).map(([k, v]) => [k, v.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: categoryTypeSchema,
}
