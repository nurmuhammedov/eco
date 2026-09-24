import { z } from 'zod'
import { schemas, territorialStaffSchema } from './territorial-staffs.schema'

export type TerritorialStaff = z.infer<typeof territorialStaffSchema>
export type TerritorialStaffTableItem = z.infer<typeof schemas.table>
export type TerritorialStaffResponse = z.infer<typeof schemas.single>
export type FilterTerritorialStaffDTO = z.infer<typeof schemas.filter>
export type CreateTerritorialStaffDTO = z.infer<typeof schemas.create>
export type UpdateTerritorialStaffDTO = z.infer<typeof schemas.update>
