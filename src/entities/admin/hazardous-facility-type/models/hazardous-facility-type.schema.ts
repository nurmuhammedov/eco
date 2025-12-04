import { z } from 'zod'

export const hazardousFacilityTypeBaseSchema = {
  name: z.string().min(1, 'Nomi majburiy'),
  description: z.string(),
}

export const hazardousFacilityTypeSchema = z.object({
  id: z.number().optional(),
  ...hazardousFacilityTypeBaseSchema,
})

export const schemas = {
  create: z.object(hazardousFacilityTypeBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(
      Object.entries(hazardousFacilityTypeBaseSchema).map(([k, validator]) => [k, validator.optional()])
    ),
  }),
  filter: z.object({
    ...Object.fromEntries(
      Object.entries(hazardousFacilityTypeBaseSchema).map(([k, validator]) => [k, validator.optional()])
    ),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: hazardousFacilityTypeSchema,
}
