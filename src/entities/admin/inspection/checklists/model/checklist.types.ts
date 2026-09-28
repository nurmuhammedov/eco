import type { z } from 'zod'
import type { SearchParamValue } from '@/shared/types/api'
import type { ChecklistCategoryType } from '../../category-types/model/category-type.types'
import type { checklistSchema } from './checklist.schema'

/** ChecklistResById (`GET /checklists/{id}`, `/checklists/by-category/{id}`) */
export interface Checklist {
  id: number
  category: ChecklistCategoryType | null
  categoryId: number | null
  categoryName: string | null
  orderNumber: number | null
  question: string | null
  negative: string | null
  corrective: string | null
}

export type ChecklistResponse = Checklist

export type ChecklistFormValues = z.infer<typeof checklistSchema>

/** ChecklistDto */
export interface CreateChecklistDTO {
  categoryId: number
  orderNumber: number
  question: string
  negative: string
  corrective: string
}

export type UpdateChecklistDTO = CreateChecklistDTO & { id: number }

export type FilterChecklistDTO = { page?: number; size?: number } & Record<string, SearchParamValue>
