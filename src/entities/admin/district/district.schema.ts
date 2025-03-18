import { z } from 'zod';

export const districtSchema = z.object({
  name: z.string().min(1, 'Tuman nomi majburiy'),
  region_id: z.string().min(1, 'Viloyat tanlash majburiy'),
});
