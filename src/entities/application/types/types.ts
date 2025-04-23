import { z } from 'zod';
import { applicationSchemas } from '../schema/application.schema';

export enum ApplicationStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export interface ApplicationFilters {
  name: string;
  search: string;
  type: string;
  status: ApplicationStatus | undefined;
}

// DTO
export type CreateApplicationDTO = z.infer<typeof applicationSchemas.create>;
export type UpdateApplicationDTO = z.infer<typeof applicationSchemas.update>;
export type FilterApplicationDTO = z.infer<typeof applicationSchemas.filter>;

// api responses
export type SingleApplicationResponse = z.infer<typeof applicationSchemas.single>;
