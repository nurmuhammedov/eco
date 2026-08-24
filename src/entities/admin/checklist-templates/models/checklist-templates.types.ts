import { z } from 'zod'
import { schemas } from './checklist-templates.schema'

export type ChecklistTemplate = z.infer<typeof schemas.single>
export type FilterChecklistTemplateDTO = z.infer<typeof schemas.filter>
export type CreateChecklistTemplateDTO = z.infer<typeof schemas.create>
export type UpdateChecklistTemplateDTO = z.infer<typeof schemas.update>
