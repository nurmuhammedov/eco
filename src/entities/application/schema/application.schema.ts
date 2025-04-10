import { z } from 'zod';
import { ApplicationStatus } from '@/entities/application';

export const applicationStatusSchema = z.nativeEnum(ApplicationStatus);

export const applicationBaseSchema = z.object({
  name: z.string(),
});

export const applicationSchema = applicationBaseSchema.extend({
  id: z.string(),
});

export const applicationSchemas = {
  create: applicationBaseSchema,
  update: z
    .object({
      id: z.string(),
    })
    .merge(applicationBaseSchema.partial()),

  filter: z
    .object({
      page: z.number(),
      size: z.number(),
      status: applicationStatusSchema.optional(),
    })
    .merge(applicationBaseSchema.partial()),
  single: applicationSchema,
};
