import {z} from 'zod';
import {CraneAppealDtoSchema, HFAppealDtoSchema, LifAppealDtoSchema} from '@/entities/create-application';

export type CreateHPOApplicationDTO = z.infer<typeof HFAppealDtoSchema>;
export type CreateCraneApplicationDTO = z.infer<typeof CraneAppealDtoSchema>;
export type CreateLiftApplicationDTO = z.infer<typeof LifAppealDtoSchema>;
