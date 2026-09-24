import { z } from 'zod'
import { userLogsSchema, schemas } from './user-logs.schema'

export type UserLogs = z.infer<typeof userLogsSchema>
export type UserLogsResponse = z.infer<typeof schemas.single>
export type FilterUserLogsDTO = z.infer<typeof schemas.filter>

export { UserLogsTypeEnum } from './user-logs.enums'
