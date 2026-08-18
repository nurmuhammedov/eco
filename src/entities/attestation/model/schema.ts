import { z } from 'zod'

export const questionSchema = z.object({
  direction: z.enum(['INDUSTRIAL_SAFETY', 'RADIATION_SAFETY', 'NUCLEAR_SAFETY'], {
    required_error: 'Majburiy maydon!',
  }),
  employee_type: z.enum(['LEADER', 'ENGINEER'], { required_error: 'Majburiy maydon!' }),
  question_text: z.string().min(1, 'Majburiy maydon!').max(2000, 'Kiritilgan ma’lumot yaroqli emas!'),
  is_active: z.boolean().default(true),
})
