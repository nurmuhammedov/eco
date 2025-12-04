import { z } from 'zod'

const ERROR_MESSAGES = {
  name_required: 'Nomi kiritilishi shart',
  child_equipment_id_required: 'Attraksion turi tanlanishi shart',
}

export const attractionTypeBaseSchema = {
  name: z.string().min(1, ERROR_MESSAGES.name_required),
  childEquipmentId: z.coerce.string({
    errorMap: () => ({ message: ERROR_MESSAGES.child_equipment_id_required }),
  }),
}

export const schemas = {
  create: z.object(attractionTypeBaseSchema),
  update: z.object({
    id: z.number().optional(),
    name: z.string(),
    childEquipmentId: z.coerce.string(),
  }),
  filter: z.object({
    name: z.string(),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: z.object({
    id: z.number(),
    name: z.string(),
    childEquipment: z.string(),
  }),
}
