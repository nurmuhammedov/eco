import { z } from 'zod';
import { equipmentSchema, schemas } from './equipment.schema';

export type Equipment = z.infer<typeof equipmentSchema>;
export type EquipmentResponse = z.infer<typeof schemas.single>;
export type FilterEquipmentDTO = z.infer<typeof schemas.filter>;
export type CreateEquipmentDTO = z.infer<typeof schemas.create>;
export type UpdateEquipmentDTO = z.infer<typeof schemas.update>;
