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
  CADASTRE = 'CADASTRE',
  ATTESTATION_REGIONAL = 'ATTESTATION_REGIONAL',
  ACCIDENT = 'ACCIDENT',
}

export type UserState = {
  id: string
  name: string
  tinOrPin: number
  role: UserRoles
  directions: Direction[]
  isSupervisor?: boolean
}
