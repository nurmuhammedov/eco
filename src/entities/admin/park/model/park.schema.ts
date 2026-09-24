import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export const parkSchema = z.object({
  name: z.string().min(1, FORM_ERROR_MESSAGES.required),
  regionId: z.union([z.number(), z.string()]).refine((val) => val !== '' && val !== 0, FORM_ERROR_MESSAGES.required),
  districtId: z.union([z.number(), z.string()]).refine((val) => val !== '' && val !== 0, FORM_ERROR_MESSAGES.required),
  address: z.string().min(1, FORM_ERROR_MESSAGES.required),
  location: z.string().nullable().optional(),
})

export type ParkSchemaType = z.infer<typeof parkSchema>
