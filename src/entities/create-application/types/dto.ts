import { z } from 'zod';
import { CraneAppealDtoSchema, HFAppealDtoSchema } from '@/entities/create-application';

export type CreateHPOApplicationDTO = z.infer<typeof HFAppealDtoSchema>;
export type CreateCraneApplicationDTO = z.infer<typeof CraneAppealDtoSchema>;
