export enum UserRoles {
  LEGAL = 'LEGAL', // Yuridik shaxs
  HEAD = 'HEAD', // Ma'sul bo'lim boshlig'i
  ADMIN = 'ADMIN', // Ma'mur
  MANAGER = 'MANAGER', // Ma'sul xodim
  CHAIRMAN = 'CHAIRMAN', // Rais
  REGIONAL = 'REGIONAL', // Hududiy bo'lim boshlig'i
  INSPECTOR = 'INSPECTOR', // Nazoratchi
  INDIVIDUAL = 'INDIVIDUAL', // Jismoniy shaxs
}

export enum Direction {
  APPEAL = 'APPEAL',
  REGISTRY = 'REGISTRY',
  RISK_ANALYSIS = 'RISK_ANALYSIS',
  INSPECTION = 'INSPECTION',
  PREVENTION = 'PREVENTION',
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
  id: number;
  year: number;
  startDate: string;
  endDate: string;
  status: 'CURRENT' | 'PAST' | 'FUTURE';
}

export type UserState = {
  id: string;
  name: string;
  interval: IInterval;
  role: UserRoles;
  directions: Direction[];
};
