import { z } from 'zod'

export const templateFormSchema = z.object({
  name: z.string().min(2, { message: 'Nomi kamida 2 ta belgidan iborat bo‘lishi shart' }).max(50),
  description: z.string().max(250, { message: 'Tavsif 250 belgidan oshmasligi kerak' }).optional(),
  type: z.string().min(1, { message: 'Shablon turini tanlang' }),
})
