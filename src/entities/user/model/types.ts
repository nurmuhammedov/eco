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

export type UserState = {
  id: string;
  name: string;
  role: UserRoles;
  directions: Direction[];
};
