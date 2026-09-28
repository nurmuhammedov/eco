import type { z } from 'zod'
import type { SearchParamValue } from '@/shared/types/api'
import type { categoryTypeSchema } from './category-type.schema'

/** ChecklistCategoryType: the kinds of objects a checklist is written for */
export type ChecklistCategoryType = 'HF' | 'ELEVATOR' | 'ATTRACTION' | 'IRS' | 'XRAY' | 'LPG_POWERED' | 'OTHERS'

/** ChecklistCategory (`GET /checklists/categories`) */
export interface CategoryType {
  id: number
  type: ChecklistCategoryType | null
  name: string | null
}

export type CategoryTypeResponse = CategoryType

export type CreateCategoryTypeDTO = z.infer<typeof categoryTypeSchema>

export type UpdateCategoryTypeDTO = CreateCategoryTypeDTO & { id: number }

export type FilterCategoryTypeDTO = { page?: number; size?: number } & Record<string, SearchParamValue>

/** ChecklistCategory as the select lists it; `type` is the kind of object it applies to */
export interface ChecklistCategoryOption {
  id: number
  name: string
  type: string | null
}
