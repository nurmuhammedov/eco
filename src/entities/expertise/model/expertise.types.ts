import { z } from 'zod'
import { addExpertiseSchema, addOldExpertiseSchema } from './expertise.schema'

export type AddExpertiseFormValues = z.infer<typeof addExpertiseSchema>
export type AddOldExpertiseFormValues = z.infer<typeof addOldExpertiseSchema>
/** An old declaration as it is filled in: its dates are still the picked days */
export type AddOldExpertiseFormDraft = z.input<typeof addOldExpertiseSchema>
