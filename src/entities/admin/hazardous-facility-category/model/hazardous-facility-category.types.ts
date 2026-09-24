import { z } from 'zod'
import { hazardousFacilityCategorySchema, schemas } from './hazardous-facility-category.schema'

export type HazardousFacilityCategoryTableItem = z.infer<typeof hazardousFacilityCategorySchema>
export type HazardousFacilityCategoryResponse = z.infer<typeof schemas.single>
export type FilterHazardousFacilityCategoryDTO = z.infer<typeof schemas.filter>
export type CreateHazardousFacilityCategoryDTO = z.infer<typeof schemas.create>
export type UpdateHazardousFacilityCategoryDTO = z.infer<typeof schemas.update>
