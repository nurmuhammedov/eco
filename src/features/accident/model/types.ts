import { z } from 'zod'
import { format } from 'date-fns'

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
  birthDate: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  address: z.string().min(1).trim(),
  position: z.string().min(1).trim(),
  experience: z.string().min(1),
  maritalStatus: z.string().min(1).trim(),
  injuryStatus: z.nativeEnum(InjuryStatus),
})

/** InitialInjuryAccidentDto: an injury is filed with three fields, the rest comes in the inspection */
export const accidentCreateSchema = z.object({
  hfId: z.string().min(1),
  date: z.date().transform((date) => format(date, 'yyyy-MM-dd')),
  shortDetail: z.string().min(1).trim(),
})

/** InjuryAccidentDto */
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

/** A LocalDateTime: the wall-clock time picked, not UTC */
const localDateTime = z.date().transform((date) => format(date, "yyyy-MM-dd'T'HH:mm:ss"))

/** InitialNonInjuryAccidentDto */
export const accidentNonInjuryCreateSchema = z.object({
  hfId: z.string().min(1),
  dateTime: localDateTime,
  shortDetail: z.string().min(1).trim(),
})

/** NonInjuryAccidentDto */
export const accidentNonInjuryEditSchema = accidentNonInjuryCreateSchema.extend({
  economicLoss: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  stoppedFrom: localDateTime.optional().nullable(),
  stoppedTo: localDateTime.optional().nullable(),
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

export type AccidentPayload = z.output<typeof accidentEditSchema>

/** A victim as the form holds them: a new row has no date or outcome picked yet */
type VictimDraft = Omit<z.input<typeof victimSchema>, 'birthDate' | 'injuryStatus'> & {
  birthDate?: Date
  injuryStatus?: InjuryStatus
}

export type AccidentFormValues = Omit<z.input<typeof accidentEditSchema>, 'date' | 'victims'> & {
  date?: Date
  victims: VictimDraft[]
}

export const EMPTY_VICTIM: VictimDraft = {
  fullName: '',
  address: '',
  position: '',
  experience: '',
  maritalStatus: '',
}

export type AccidentNonInjuryPayload = z.output<typeof accidentNonInjuryEditSchema>

/** The form's times stay unpicked until someone picks them */
export type AccidentNonInjuryFormValues = Omit<
  z.input<typeof accidentNonInjuryEditSchema>,
  'dateTime' | 'stoppedFrom' | 'stoppedTo'
> & {
  dateTime?: Date
  stoppedFrom?: Date | null
  stoppedTo?: Date | null
}

export type AccidentType = 'INJURY' | 'NON_INJURY'

/** AccidentInspector: a member of the investigating commission */
export interface AccidentInspector {
  inspectorId: string
  name: string | null
}

/** AccidentRes (`GET /accidents`) */
export interface AccidentListItem {
  id: string
  legalName: string | null
  legalTin: number | null
  hfName: string | null
  status: AccidentProcessStatus | null
  type: AccidentType | null
  minorInjuryCount: number | null
  seriousInjuryCount: number | null
  fatalInjuryCount: number | null
  multiple: boolean | null
  shortDetail: string | null
  date: string | null
  dateTime: string | null
  mainInspector: AccidentInspector | null
  inspectors: AccidentInspector[] | null
  decreePath: string | null
}

/** Victim, as AccidentResById lists them */
export interface AccidentVictim {
  fullName: string | null
  birthDate: string | null
  address: string | null
  position: string | null
  experience: string | null
  maritalStatus: string | null
  injuryStatus: InjuryStatus | null
}

/** AccidentResById (`GET /accidents/{id}`): one shape for both kinds, each filling its own fields */
export interface AccidentDetail {
  legalName: string | null
  legalTin: number | null
  hfId: string | null
  hfName: string | null
  type: AccidentType | null
  status: AccidentProcessStatus | null
  shortDetail: string | null
  minorInjuryCount: number | null
  seriousInjuryCount: number | null
  fatalInjuryCount: number | null
  multiple: boolean | null
  mainInspector: AccidentInspector | null
  inspectors: AccidentInspector[] | null
  decreePath: string | null
  specialActPath: string | null
  commissionOrderPath: string | null
  othersPath: string | null
  preventions: string | null
  // Injury
  date: string | null
  conditions: string | null
  lettersInfo: string | null
  analyses: string | null
  recommendations: string | null
  n1ActPath: string | null
  planSchemaPath: string | null
  victims: AccidentVictim[] | null
  // Non-injury
  dateTime: string | null
  economicLoss: number | null
  stoppedFrom: string | null
  stoppedTo: string | null
  guiltyEmployees: string | null
  executions: string | null
}
