import { z } from 'zod'

export enum InjuryStatus {
  MINOR = 'MINOR',
  SERIOUS = 'SERIOUS',
  FATAL = 'FATAL',
}

export const victimSchema = z.object({
  fullName: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  birthYear: z
    .string({ required_error: 'Majburiy maydon!' })
    .min(1, 'Majburiy maydon!')
    .transform((val) => Number(val)),
  position: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  experience: z
    .string({ required_error: 'Majburiy maydon!' })
    .min(1, 'Majburiy maydon!')
    .transform((val) => Number(val)),
  maritalStatus: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
  injuryStatus: z.nativeEnum(InjuryStatus, { required_error: 'Majburiy maydon!' }),
})

export const accidentSchema = z.object({
  hfId: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!'),
  date: z.date({ required_error: 'Majburiy maydon!' }).transform((date) => date.toISOString().split('T')[0]),
  shortDetail: z.string({ required_error: 'Majburiy maydon!' }).min(1, 'Majburiy maydon!').trim(),
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
  victims: z.array(victimSchema).min(1, 'Kamida bitta jabrlanuvchi bo‘lishi shart!'),
})

export interface AccidentListItem {
  id: string
  legalName: string
  legalTin: string
  hfName: string
  minorInjuryCount: number
  seriousInjuryCount: number
  fatalInjuryCount: number
  multiple: boolean
}

export type Victim = z.infer<typeof victimSchema>
export type Accident = z.infer<typeof accidentSchema> & { id?: string }
