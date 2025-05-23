import { z } from 'zod';
import { schemas, territorialDepartmentsSchema } from './territorial-departments.schema.ts';

export type TerritorialDepartment = z.infer<typeof territorialDepartmentsSchema>;
export type TerritorialDepartmentResponse = z.infer<typeof schemas.single>;
export type FilterTerritorialDepartmentsDTO = z.infer<typeof schemas.filter>;
export type CreateTerritorialDepartmentsDTO = z.infer<typeof schemas.create>;
export type UpdateTerritorialDepartmentsDTO = z.infer<typeof schemas.update>;
