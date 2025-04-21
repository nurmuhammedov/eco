import { z } from 'zod';
import { HFAppealDtoSchema } from '../schemas/register-hpo.schema';

export type HPOApplicationDTO = z.infer<typeof HFAppealDtoSchema>;
