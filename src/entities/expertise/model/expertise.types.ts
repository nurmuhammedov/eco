import { z } from 'zod'
import { addExpertiseSchema, addOldExpertiseSchema } from './expertise.schema'

export type AddExpertiseFormValues = z.infer<typeof addExpertiseSchema>
export type AddOldExpertiseFormValues = z.infer<typeof addOldExpertiseSchema>
