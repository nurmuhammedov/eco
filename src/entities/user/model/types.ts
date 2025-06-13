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
  ACCREDITATION = 'ACCREDITATION',
  ATTESTATION = 'ATTESTATION',
  CERTIFICATE = 'CERTIFICATE',
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
