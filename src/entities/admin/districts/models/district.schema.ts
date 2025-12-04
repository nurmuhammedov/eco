import { z } from 'zod'

export const districtBaseSchema = {
  name: z.string().min(1, 'Tuman nomi majburiy'),
  soato: z.coerce.string().min(1, 'MHOBTni kiritish majburiy'),
  number: z.coerce.string().min(1, 'Raqamni kiritish majburiy'),
  regionId: z.string().min(1, 'Viloyatni tanlash majburiy'),
}

export const districtSchema = z.object({
  id: z.number().optional(),
  ...districtBaseSchema,
})

export const schemas = {
  create: z.object(districtBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(Object.entries(districtBaseSchema).map(([k, validator]) => [k, validator.optional()])),
  }),
  filter: z.object({
    ...Object.fromEntries(Object.entries(districtBaseSchema).map(([k, validator]) => [k, validator.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: districtSchema,
}
