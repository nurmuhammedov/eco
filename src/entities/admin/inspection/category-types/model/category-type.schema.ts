import { z } from 'zod'

/** ChecklistCategoryDto: which kind of object the checklist is for, and its name */
export const categoryTypeSchema = z.object({
  type: z.string().min(1),
  name: z.string().trim().min(1),
})
