import { z } from 'zod'
import { userLogsSchema, schemas } from './user-logs.schema'

export type UserLogs = z.infer<typeof userLogsSchema>
export type UserLogsResponse = z.infer<typeof schemas.single>
export type FilterUserLogsDTO = z.infer<typeof schemas.filter>

export enum UserLogsTypeEnum {
  NEW = 'NEW',
  IN_PROCESS = 'IN_PROCESS',
  IN_AGREEMENT = 'IN_AGREEMENT',
  IN_APPROVAL = 'IN_APPROVAL',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
}
