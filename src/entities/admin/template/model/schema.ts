import { z } from 'zod'

export const templateFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(250).optional(),
  type: z.string().min(1),
})
