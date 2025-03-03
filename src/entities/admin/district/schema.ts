import { z } from 'zod';

export const districtSchema = z.object({
  name: z.string(),
  region_id: z.number().positive('Invalid region ID'),
});

export type DistrictFormValues = z.infer<typeof districtSchema>;
