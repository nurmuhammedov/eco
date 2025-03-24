import { z } from 'zod';
import { regionSchema } from './region.schema';

export type CreateRegionDTO = {
  name: string;
  soato: number;
  number: number;
};

export type UpdateRegionDTO = {
  id: number;
  name: string;
  soato: number;
  number: number;
};

export type Region = {
  id: number;
  name: string;
  soato: number;
  number: number;
};

export type RegionFormValues = z.infer<typeof regionSchema>;
