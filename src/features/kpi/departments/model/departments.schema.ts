import { z } from 'zod'

export const departmentSchema = z.object({
  name: z.string().min(1, 'Majburiy maydon!'),
  is_active: z.boolean().default(true),
  responsible_id: z.string().nullable().optional(),
  responsible_username: z.string().nullable().optional(),
  responsible_name: z.string().nullable().optional(),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>
