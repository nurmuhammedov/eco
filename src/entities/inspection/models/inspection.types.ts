import { z } from 'zod';
import { inspectionSchema } from './inspection.schema';

export type Inspection = z.infer<typeof inspectionSchema>;
