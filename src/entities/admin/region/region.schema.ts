import { z } from 'zod';

export const regionSchema = z.object({
  name: z.string().min(1, 'Viloyat nomi majburiy'),
  soato: z.coerce.number().min(1, 'МҲОБТni kiritish majburiy'),
  // coerce.number() stringlarni avtomatik raqamlarga aylantiradi
  number: z.coerce.number().min(1, 'Raqamni kiritish majburiy'),
});
