import { z } from 'zod'

/** The checklist question form: the object kind narrows the category list it is picked from */
export const checklistSchema = z.object({
  category: z.string().min(1),
  categoryTypeId: z.string().min(1),
  orderNumber: z.string().min(1),
  question: z.string().min(1),
  negative: z.string().min(1),
  corrective: z.string().min(1),
})
