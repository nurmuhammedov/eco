import { z } from 'zod'
import { checklistSchemas } from './checklist.schema'

export type Checklist = z.infer<typeof checklistSchemas.single>
export type ChecklistResponse = z.infer<typeof checklistSchemas.single>
export type CreateChecklistDTO = z.infer<typeof checklistSchemas.create>
export type UpdateChecklistDTO = z.infer<typeof checklistSchemas.update>
export type FilterChecklistDTO = z.infer<typeof checklistSchemas.filter>
