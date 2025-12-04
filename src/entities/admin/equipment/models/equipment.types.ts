import { z } from 'zod'
import { equipmentSchema, schemas } from './equipment.schema'

export type Equipment = z.infer<typeof equipmentSchema>
export type EquipmentResponse = z.infer<typeof schemas.single>
export type FilterEquipmentDTO = z.infer<typeof schemas.filter>
export type CreateEquipmentDTO = z.infer<typeof schemas.create>
export type UpdateEquipmentDTO = z.infer<typeof schemas.update>

export enum EquipmentTypeEnum {
  CRANE = 'CRANE',
  CONTAINER = 'CONTAINER',
  BOILER = 'BOILER',
  ELEVATOR = 'ELEVATOR',
  ESCALATOR = 'ESCALATOR',
  CABLEWAY = 'CABLEWAY',
  HOIST = 'HOIST',
  ATTRACTION = 'ATTRACTION',
  PIPELINE = 'PIPELINE',
  CHEMICAL_CONTAINER = 'CHEMICAL_CONTAINER',
  HEAT_PIPELINE = 'HEAT_PIPELINE',
  BOILER_UTILIZER = 'BOILER_UTILIZER',
  LPG_CONTAINER = 'LPG_CONTAINER',
  LPG_POWERED = 'LPG_POWERED',
}
