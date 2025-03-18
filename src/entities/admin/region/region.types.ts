import { z } from 'zod';
import { regionSchema } from './region.schema.ts';

export type CreateRegionDTO = {
  name: string;
};

export type UpdateRegionDTO = {
  id: number;
  name: string;
};

export type Region = {
  id: number;
  name: string;
  code: string;
};

export type RegionFormValues = z.infer<typeof regionSchema>;
