import { z } from 'zod'

export const checklistBaseSchema = {
  category: z.string().min(1, 'Kategoriya majburiy'),
  categoryTypeId: z.string().min(1, 'Tekshiruv turini tanlash majburiy'),
  orderNumber: z.string().min(1, 'Navbat raqami'),
  question: z.string().min(1, 'Savolni kiriting'),
  negative: z.string().min(1, 'Yo‘q belgilanganda dalolatnomaga tushadigan matnni kiriting'),
  corrective: z.string().min(1, 'Yo‘q belgilanganda qilinadigan chora-tadbir matnni kiriting'),
}

export const checklistSchema = z.object({
  id: z.number().optional(),
  categoryTypeName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  ...checklistBaseSchema,
})

export const checklistSchemas = {
  create: z.object(checklistBaseSchema),
  update: z.object({
    id: z.number(),
    ...Object.fromEntries(Object.entries(checklistBaseSchema).map(([k, v]) => [k, v.optional()])),
  }),
  filter: z.object({
    ...Object.fromEntries(Object.entries(checklistBaseSchema).map(([k, v]) => [k, v.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: checklistSchema,
}
