import { z } from 'zod';
import { schemas } from './prevention.schema';

export type Prevention = z.infer<typeof schemas.single>;
export type PreventionList = z.infer<typeof schemas.list>;
export type PreventionListResponse = z.infer<typeof schemas.listResponse>;
export type CreatePreventionDTO = z.infer<typeof schemas.create>;
export type PreventionType = z.infer<typeof schemas.preventionType>;
