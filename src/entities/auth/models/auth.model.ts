import { UserRoles } from '@/shared/types';

export type AuthUser = {
  id: string;
  name: string;
  role: UserRoles;
  directions: string[];
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};
