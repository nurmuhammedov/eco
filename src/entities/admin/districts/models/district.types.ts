import { z } from 'zod'
import { districtSchema, schemas } from './district.schema'

export type District = z.infer<typeof districtSchema>
export type DistrictResponse = z.infer<typeof schemas.single>
export type FilterDistrictDTO = z.infer<typeof schemas.filter>
export type CreateDistrictDTO = z.infer<typeof schemas.create>
export type UpdateDistrictDTO = z.infer<typeof schemas.update>
