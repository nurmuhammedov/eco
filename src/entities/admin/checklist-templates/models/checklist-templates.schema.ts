// src/entities/admin/checklist-templates/models/checklist-templates.schema.ts
import { z } from 'zod'

const ERROR_MESSAGES = {
  name_required: 'Cheklist nomi kiritilishi shart',
  path_required: 'Cheklist fayli yuklanishi shart',
  path_invalid: 'Fayl formati faqat .pdf boʻlishi kerak',
}

const pdfFileSchema = z
  .string()
  .min(1, ERROR_MESSAGES.path_required)
  .refine((value) => value.toLowerCase().endsWith('.pdf'), {
    message: ERROR_MESSAGES.path_invalid,
  })

export const checklistTemplateBaseSchema = {
  name: z.string().min(1, ERROR_MESSAGES.name_required),
  path: pdfFileSchema,
  active: z.boolean().default(true),
}

export const schemas = {
  create: z.object(checklistTemplateBaseSchema),
  update: z.object({
    id: z.number(),
    name: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? val : null)),
    path: pdfFileSchema.optional(),
    active: z.boolean().optional(),
  }),
  filter: z.object({
    name: z.string().optional(),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
    active: z.boolean().optional(),
  }),
  single: z.object({
    id: z.number(),
    ...checklistTemplateBaseSchema,
  }),
}
