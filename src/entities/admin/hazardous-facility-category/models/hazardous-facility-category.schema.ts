import { z } from 'zod'

export const hazardousFacilityCategoryBaseSchema = {
  name: z.string().min(1, 'Nomi majburiy'),
}

export const hazardousFacilityCategorySchema = z.object({
  id: z.number().optional(),
  ...hazardousFacilityCategoryBaseSchema,
})

export const schemas = {
  create: z.object(hazardousFacilityCategoryBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(hazardousFacilityCategoryBaseSchema).map(([k, validator]) => [k, validator.optional()])
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(hazardousFacilityCategoryBaseSchema).map(([k, validator]) => [k, validator.optional()])
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: hazardousFacilityCategorySchema,
}
