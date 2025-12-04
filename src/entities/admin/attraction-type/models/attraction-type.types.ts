import { z } from 'zod'
import { schemas } from './attraction-type.schema'

export type AttractionType = z.infer<typeof schemas.single>
export type FilterAttractionTypeDTO = z.infer<typeof schemas.filter>
export type CreateAttractionTypeDTO = z.infer<typeof schemas.create>
export type UpdateAttractionTypeDTO = z.infer<typeof schemas.update>
export type AttractionTypeResponse = z.infer<typeof schemas.single>
