import { UserState } from '@/entities/user';

export type AuthState = {
  user: UserState | null;
  isAuthenticated: boolean;
};
