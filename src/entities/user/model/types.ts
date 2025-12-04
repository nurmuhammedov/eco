export enum UserRoles {
  LEGAL = 'LEGAL', // Yuridik shaxs
  HEAD = 'HEAD', // Maʼsul bo‘lim boshlig‘i
  ADMIN = 'ADMIN', // Maʼmur
  MANAGER = 'MANAGER', // Maʼsul xodim
  CHAIRMAN = 'CHAIRMAN', // Rais
  REGIONAL = 'REGIONAL', // Hududiy bo‘lim boshlig‘i
  INSPECTOR = 'INSPECTOR', // Inspektor
  INDIVIDUAL = 'INDIVIDUAL', // Jismoniy shaxs
}

export const UserRoleLabels: Record<UserRoles, string> = {
  [UserRoles.LEGAL]: 'Yuridik shaxs',
  [UserRoles.HEAD]: 'Maʼsul bo‘lim boshlig‘i',
  [UserRoles.ADMIN]: 'Maʼmur',
  [UserRoles.MANAGER]: 'Maʼsul xodim',
  [UserRoles.CHAIRMAN]: 'Rais',
  [UserRoles.REGIONAL]: 'Hududiy bo‘lim boshlig‘i',
  [UserRoles.INSPECTOR]: 'Inspektor',
  [UserRoles.INDIVIDUAL]: 'Jismoniy shaxs',
}

export enum Direction {
  APPEAL = 'APPEAL',
  REGISTRY = 'REGISTRY',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
  INSPECTION = 'INSPECTION',
  PREVENTION = 'PREVENTION',
  // ATTESTATION_COMMITTEE: 'ATTESTATION_COMMITTEE',
  ATTESTATION_REGIONAL = 'ATTESTATION_REGIONAL',
  ACCREDITATION = 'ACCREDITATION',
  CADASTRE = 'CADASTRE',
  PERMITS = 'PERMITS',
  HF = 'HF',
  IRS = 'IRS',
  EQUIPMENT = 'EQUIPMENT',
  REPORT = 'REPORT',
}

interface IInterval {
  id: number
  year: number
  startDate: string
  endDate: string
  status: 'CURRENT' | 'PAST' | 'FUTURE'
}

export type UserState = {
  id: string
  name: string
  interval: IInterval
  role: UserRoles
  directions: Direction[]
}
