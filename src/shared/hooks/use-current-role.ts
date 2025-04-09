import { UserRoles } from '@/entities/user';
import { useAuth } from '@/shared/hooks/use-auth.ts';

export const useCurrentRole = () => {
  const { user } = useAuth();
  return user?.role || UserRoles.LEGAL;
};
