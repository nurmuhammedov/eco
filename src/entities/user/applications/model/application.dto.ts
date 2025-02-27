import { z } from 'zod';
import { CreateRegisterCrane } from './application-crane.schema';
import { ApplicationBaseSchema } from './application-base.schema';
import { CreateRegisterHPOSchema } from './application-hpo.schema';
import { CreateRegisterBoiler } from './application-boiler.schema';
import { CreateRegisterPressureVesselChemicalSchema } from './application-pressure-vessel-chemical.schema';

export type CreateRegisterHpoDTO = z.infer<typeof CreateRegisterHPOSchema>;
export type CreateRegisterCraneDTO = z.infer<typeof CreateRegisterCrane>;
export type CreateRegisterBoilerDTO = z.infer<typeof CreateRegisterBoiler>;
export type CreateRegisterPressureVesselChemicalDTO = z.infer<
  typeof CreateRegisterPressureVesselChemicalSchema
>;

export type ApplicationBaseDTO = z.infer<typeof ApplicationBaseSchema>;
