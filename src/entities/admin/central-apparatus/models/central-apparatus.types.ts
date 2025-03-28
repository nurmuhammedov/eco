import { z } from 'zod';
import { centralApparatusSchema, schemas } from './central-apparatus.schema.ts';

export type CentralApparatus = z.infer<typeof centralApparatusSchema>;
export type CentralApparatusResponse = z.infer<typeof schemas.single>;
export type FilterCentralApparatusDTO = z.infer<typeof schemas.filter>;
export type CreateCentralApparatusDTO = z.infer<typeof schemas.create>;
export type UpdateCentralApparatusDTO = z.infer<typeof schemas.update>;
