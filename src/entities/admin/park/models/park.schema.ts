import { z } from 'zod'
import { FORM_ERROR_MESSAGES } from '@/shared/validation'

export const parkSchema = z.object({
  name: z.string().min(1, FORM_ERROR_MESSAGES.required),
  regionId: z.number().min(1, FORM_ERROR_MESSAGES.required),
  districtId: z.number().min(1, FORM_ERROR_MESSAGES.required),
  address: z.string().min(1, FORM_ERROR_MESSAGES.required),
  location: z.string().min(1, FORM_ERROR_MESSAGES.required),
})

export type ParkSchemaType = z.infer<typeof parkSchema>
