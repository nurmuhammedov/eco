import { z } from 'zod';
import {
  ApplicationBaseSchema,
  defaultRequiredMessage,
  emailMessage,
} from './application-base.schema.ts';

export const CreateRegisterHPOSchema = ApplicationBaseSchema.extend({
  parent_name: z.string(defaultRequiredMessage),
  fileUrls: z
    .array(z.string().url())
    .min(1, 'Камида 1 та файл юкланиши керак')
    .default([]),
  organization_name: z.string(defaultRequiredMessage),
  organization_email: z.string(defaultRequiredMessage).email(emailMessage),
  tin: z.string(defaultRequiredMessage).length(9, 'СТИР 9 хона сондан иборат'),
  hpo_name: z.string(defaultRequiredMessage),
  hpo_type: z.string(defaultRequiredMessage),
  hpo_objects_name: z.string(defaultRequiredMessage),
  hazardous_name: z.string(defaultRequiredMessage),
  reason: z.string(defaultRequiredMessage),
  networks: z.string(defaultRequiredMessage),
  region: z.string(defaultRequiredMessage),
  district: z.string(defaultRequiredMessage),
  address: z.tuple([z.number(), z.number()]),
  description: z.string(defaultRequiredMessage),
  hpoId: z.string().optional(),
});
