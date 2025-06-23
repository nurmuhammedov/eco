import { z } from 'zod';

export const inspectionSchema = z.object({
  id: z.string().uuid(),
  tin: z.number(),
  regionName: z.string(),
  districtName: z.string(),
  legalName: z.string(),
  legalAddress: z.string(),
});
