import { z } from 'zod';
import { districtSchema } from './district.schema';

export type CreateDistrictDTO = {
  name: string;
};

export type UpdateDistrictDTO = {
  id: number;
  name: string;
};

export type District = {
  id: number;
  name: string;
  region: {
    id: number;
    name: string;
  };
};

export type DistrictFormValues = z.infer<typeof districtSchema>;
