export enum UserRoles {
  LEGAL = 'LEGAL', // Yuridik shaxs
  HEAD = 'HEAD', // Maʼsul bo‘lim boshlig‘i
  ADMIN = 'ADMIN', // Maʼmur
  MANAGER = 'MANAGER', // Maʼsul xodim
  CHAIRMAN = 'CHAIRMAN', // Rais
  REGIONAL = 'REGIONAL', // Hududiy bo‘lim boshlig‘i
  INSPECTOR = 'INSPECTOR', // Inspektor
  INDIVIDUAL = 'INDIVIDUAL', // Jismoniy shaxs
  PROCURATOR = 'PROCURATOR', // Prokuratura
  INTERACTIVE_SERVICE = 'INTERACTIVE_SERVICE', // Interaktiv oyna
  ACCOUNTANT = 'ACCOUNTANT', // Hisobchi
  HR = 'HR', // HR
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
  [UserRoles.PROCURATOR]: 'Prokuratura',
  [UserRoles.INTERACTIVE_SERVICE]: 'Interaktiv oyna',
  [UserRoles.ACCOUNTANT]: 'Hisobchi',
  [UserRoles.HR]: 'Xodimlar bo‘yicha menejer',
}

export enum Direction {
  HF = 'HF',
  IRS = 'IRS',
  EQUIPMENT = 'EQUIPMENT',
  XRAY = 'XRAY',
  APPEAL = 'APPEAL',
  REGISTRY = 'REGISTRY',
  PREVENTION = 'PREVENTION',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
  INSPECTION = 'INSPECTION',
  ACCREDITATION = 'ACCREDITATION',
  CONCLUSION = 'CONCLUSION',
  DECLARATION = 'DECLARATION',
  PERMITS = 'PERMITS',
  REPORT = 'REPORT',
  INQUIRY = 'INQUIRY',
  ATTESTATION = 'ATTESTATION',
  ACCIDENT = 'ACCIDENT',
  ELEVATOR = 'ELEVATOR',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ARCHIVE = 'ARCHIVE',
  CADASTRE_PASSPORT = 'CADASTRE_PASSPORT',
  KPI = 'KPI',
}

export type UserState = {
  id: string
  name: string
  tinOrPin: number
  role: UserRoles
  directions: Direction[]
  isSupervisor?: boolean
  isController?: boolean
  regionId?: number
  delegated?: boolean
  delegatorId?: string | null
}
