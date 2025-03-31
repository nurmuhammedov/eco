export enum UserRoles {
  LEGAL = 'LEGAL',
  HEAD = 'HEAD',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  CHAIRMAN = 'CHAIRMAN',
  REGIONAL = 'REGIONAL',
  INSPECTOR = 'INSPECTOR',
  INDIVIDUAL = 'INDIVIDUAL',
}

export type UserState = {
  id: string;
  name: string;
  role: UserRoles;
  directions: string[];
};
