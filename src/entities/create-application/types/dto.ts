import { z } from 'zod';
import { HFAppealDtoSchema } from '@/entities/create-application';

export type CreateHPOApplicationDTO = z.infer<typeof HFAppealDtoSchema>;
