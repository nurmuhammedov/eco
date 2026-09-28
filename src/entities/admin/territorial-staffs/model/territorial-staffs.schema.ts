import { z } from 'zod'
import { staffFields } from '@/entities/admin/committee-staffs/model/committee-staffs.schema'

export const territorialStaffSchema = z.object({
  ...staffFields,
  officeId: z.string().min(1),
})

export type TerritorialStaffFormValues = z.input<typeof territorialStaffSchema>
