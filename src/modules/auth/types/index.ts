import { UserRoles } from '@/shared/types';

export type User = {
  id: number;
  email: string;
  roles: UserRoles[];
  last_name: string;
  first_name: string;
  permissions: string[];
};

export type AuthState = {
  user: User;
  isAuthenticated: boolean;
};
