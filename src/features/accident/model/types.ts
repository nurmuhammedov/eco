import { z } from 'zod'

export enum InjuryStatus {
  MINOR = 'MINOR',
  SERIOUS = 'SERIOUS',
  FATAL = 'FATAL',
}

export const victimSchema = z.object({
  fullName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  birthDate: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => date.toISOString().split('T')[0]),
  address: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  position: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  experience: z
    .string({ required_error: 'Majburiy maydon!' })
    .min(1, 'Majburiy maydon!')
    .transform((val) => val),
  maritalStatus: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  injuryStatus: z.nativeEnum(InjuryStatus, { required_error: 'Majburiy maydon!' }),
})

// Schema for Creating an Accident (Only 3 fields required)
export const accidentCreateSchema = z.object({
  hfId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  date: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => date.toISOString().split('T')[0]),
  shortDetail: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
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
  protocolPath: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? val : null)),
  victims: z.array(victimSchema).min(1, 'Kamida bitta jabrlanuvchi bo‘lishi shart!'),
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
}

export type Victim = z.infer<typeof victimSchema> & {
  id?: string
  createdAt?: string
  updatedAt?: string
  accidentId?: string
}

export type AccidentFormValues = z.input<typeof accidentEditSchema> & {
  id?: string
  status?: string
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
}
