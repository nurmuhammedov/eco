import { z } from 'zod'
import { categoryTypeSchemas } from './category-type.schema'

export type CategoryType = z.infer<typeof categoryTypeSchemas.single>
export type CategoryTypeResponse = z.infer<typeof categoryTypeSchemas.single>
export type CreateCategoryTypeDTO = z.infer<typeof categoryTypeSchemas.create>
export type UpdateCategoryTypeDTO = z.infer<typeof categoryTypeSchemas.update>
export type FilterCategoryTypeDTO = z.infer<typeof categoryTypeSchemas.filter>

/** ChecklistCategory as the select lists it; `type` is the kind of object it applies to */
export interface ChecklistCategoryOption {
  id: number
  name: string
  type: string | null
}
