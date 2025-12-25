import { z } from 'zod'
import { UserLogsTypeEnum } from '@/entities/admin/user-logs'

export const UserLogsBaseSchema = {
  name: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  status: z.nativeEnum(UserLogsTypeEnum),
  ownerIdentity: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  createdAt: z.date().optional(),
  ownerName: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  username: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  appealNumber: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
}

export const userLogsSchema = z.object({
  id: z.number().optional(),
  ...UserLogsBaseSchema,
})

export const schemas = {
  filter: z.object({
    ...Object.fromEntries(Object.entries(UserLogsBaseSchema).map(([k, validator]) => [k, validator.optional()])),
    page: z.number().optional().default(1),
    size: z.number().optional().default(20),
  }),
  single: userLogsSchema,
}
