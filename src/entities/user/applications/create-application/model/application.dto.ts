import { z } from 'zod';
import { CreateRegisterLift } from './application-lift.schema.ts';
import { CreateRegisterCrane } from './application-crane.schema.ts';
import { ApplicationBaseSchema } from './application-base.schema.ts';
import { CreateRegisterHPOSchema } from './application-hpo.schema.ts';
import { CreateRegisterBoiler } from './application-boiler.schema.ts';
import { CreateRegisterPressureVesselChemicalSchema } from './application-pressure-vessel-chemical.schema.ts';

export type CreateRegisterLiftDTO = z.infer<typeof CreateRegisterLift>;
export type CreateRegisterCraneDTO = z.infer<typeof CreateRegisterCrane>;
export type CreateRegisterHpoDTO = z.infer<typeof CreateRegisterHPOSchema>;
export type CreateRegisterBoilerDTO = z.infer<typeof CreateRegisterBoiler>;
export type CreateRegisterPressureVesselChemicalDTO = z.infer<typeof CreateRegisterPressureVesselChemicalSchema>;

export type ApplicationBaseDTO = z.infer<typeof ApplicationBaseSchema>;
