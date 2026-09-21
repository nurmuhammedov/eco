import { z } from 'zod'

export const questionSchema = z.object({
  direction: z.enum(['INDUSTRIAL_SAFETY', 'RADIATION_SAFETY', 'NUCLEAR_SAFETY']),
  employee_type: z.enum(['LEADER', 'ENGINEER']),
  question_text: z.string().min(1).max(2000),
  is_active: z.boolean().default(true),
})
