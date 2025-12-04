import { z } from 'zod'
import { regionSchema, schemas } from './region.schema'

export type Region = z.infer<typeof regionSchema>
export type RegionResponse = z.infer<typeof schemas.single>
export type FilterRegionDTO = z.infer<typeof schemas.filter>
export type CreateRegionDTO = z.infer<typeof schemas.create>
export type UpdateRegionDTO = z.infer<typeof schemas.update>
