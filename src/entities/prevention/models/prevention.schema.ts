import { FORM_ERROR_MESSAGES } from '@/shared/validation';
import { z } from 'zod';

export const schemas = {
  single: z.object({
    id: z.string(),
    tin: z.number(),
    legalName: z.string(),
    legalAddress: z.string(),
    regionName: z.string(),
    date: z.string(),
    type: z.string(),
    content: z.string(),
    eventFilePath: z.string(),
    organizationFilePath: z.string(),
  }),
  list: z.object({
    id: z.string(),
    tin: z.number(),
    legalName: z.string(),
    legalAddress: z.string(),
    regionName: z.string(),
  }),
  listResponse: z.array(
    z.object({
      id: z.string(),
      tin: z.number(),
      legalName: z.string(),
      legalAddress: z.string(),
      regionName: z.string(),
    }),
  ),
  create: z.object({
    tin: z.number({ required_error: FORM_ERROR_MESSAGES.required }),
    date: z.string({ required_error: FORM_ERROR_MESSAGES.required }),
    typeId: z.coerce.number({ required_error: FORM_ERROR_MESSAGES.required }),
    content: z.string().min(1, FORM_ERROR_MESSAGES.required),
    eventFilePath: z.string().min(1, FORM_ERROR_MESSAGES.required),
    organizationFilePath: z.string().min(1, FORM_ERROR_MESSAGES.required),
  }),
  preventionType: z.object({
    id: z.number(),
    name: z.string(),
  }),
};
