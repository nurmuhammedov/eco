import { z } from 'zod';
import { hazardousFacilityTypeSchema, schemas } from './hazardous-facility-type.schema';

export type HazardousFacilityTypeTableItem = z.infer<typeof hazardousFacilityTypeSchema>;
export type HazardousFacilityTypeResponse = z.infer<typeof schemas.single>;
export type FilterHazardousFacilityTypeDTO = z.infer<typeof schemas.filter>;
export type CreateHazardousFacilityTypeDTO = z.infer<typeof schemas.create>;
export type UpdateHazardousFacilityTypeDTO = z.infer<typeof schemas.update>;
