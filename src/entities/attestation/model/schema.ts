import { z } from 'zod'

export const directionSchema = z.object({
  name: z.string().min(1, 'Majburiy maydon!'),
  is_active: z.boolean().default(true),
})

export const questionSchema = z.object({
  attestation_direction_id: z.string().min(1, "Yo'nalishni tanlang!"),
  employee_type: z.enum(['LEADER', 'ENGINEER'], { required_error: 'Xodim turini tanlang!' }),
  question_text: z.string().min(1, 'Savolni kiriting!'),
  is_active: z.boolean().default(true),
})
