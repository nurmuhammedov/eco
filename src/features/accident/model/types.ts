import { z } from 'zod'

export enum InjuryStatus {
  MINOR = 'MINOR',
  SERIOUS = 'SERIOUS',
  FATAL = 'FATAL',
}

export enum AccidentProcessStatus {
  NEW = 'NEW',
  DECREE_UPLOADED = 'DECREE_UPLOADED',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
}

export const victimSchema = z.object({
  fullName: z.string().min(1).trim(),
  birthDate: z.date().transform((date) => date.toISOString().split('T')[0]),
  address: z.string().min(1).trim(),
  position: z.string().min(1).trim(),
  experience: z
    .string()
    .min(1)
    .transform((val) => val),
  maritalStatus: z.string().min(1).trim(),
  injuryStatus: z.nativeEnum(InjuryStatus),
})

// Schema for Creating an Accident (Only 3 fields required)
export const accidentCreateSchema = z.object({
  hfId: z.string().min(1),
  date: z.date().transform((date) => date.toISOString().split('T')[0]),
  shortDetail: z.string().min(1).trim(),
})

// Schema for Editing an Accident (All fields with logic)
export const accidentEditSchema = accidentCreateSchema.extend({
  conditions: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  lettersInfo: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  analyses: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  preventions: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  recommendations: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  specialActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  n1ActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  planSchemaPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  commissionOrderPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  othersPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  victims: z.array(victimSchema).min(1),
})

export interface AccidentListItem {
  id: string
  legalName: string
  legalTin: string
  hfName: string
  status: string
  minorInjuryCount: number
  seriousInjuryCount: number
  fatalInjuryCount: number
  multiple: boolean
  type: string
  date?: string | null
  dateTime?: string | null
}

export type AccidentFormValues = z.input<typeof accidentEditSchema> & {
  id?: string
  status?: string
}

export const accidentNonInjuryCreateSchema = z.object({
  hfId: z.string().min(1),
  dateTime: z.date(),
  shortDetail: z.string().min(1).trim(),
})

export const accidentNonInjuryEditSchema = accidentNonInjuryCreateSchema.extend({
  economicLoss: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  stoppedFrom: z.date().optional().nullable(),
  stoppedTo: z.date().optional().nullable(),
  guiltyEmployees: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  preventions: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  executions: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  specialActPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  commissionOrderPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  othersPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
})

export type AccidentNonInjuryFormValues = z.input<typeof accidentNonInjuryEditSchema> & {
  id?: string
  status?: string
}

export type AccidentNonInjury = z.output<typeof accidentNonInjuryEditSchema> & {
  id?: string
  legalName?: string
  legalDirectorName?: string
  legalAddress?: string
  legalPhone?: string
  legalTin?: string
  hfName?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  type?: string
  accidentDecreePath?: string
  mainInspectorId?: string
  inspectorIds?: string[]
  mainInspector?: { inspectorId: string; name: string }
  inspectors?: { inspectorId: string; name: string }[]
  decreePath?: string
}

export type Accident = z.output<typeof accidentEditSchema> & {
  id?: string
  legalName?: string
  legalDirectorName?: string
  legalAddress?: string
  legalPhone?: string
  legalTin?: string
  hfName?: string
  status?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  type?: string
  accidentDecreePath?: string
  mainInspectorId?: string
  inspectorIds?: string[]
  mainInspector?: { inspectorId: string; name: string }
  inspectors?: { inspectorId: string; name: string }[]
  decreePath?: string
}
