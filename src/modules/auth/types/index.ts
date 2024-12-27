import { UserRoles } from '@/shared/types';

export type AuthUser = {
  id: number;
  email: string;
  role: UserRoles;
  last_name: string;
  first_name: string;
  permissions: string[];
};

export type AuthState = {
  user: AuthUser;
  isAuthenticated: boolean;
};
