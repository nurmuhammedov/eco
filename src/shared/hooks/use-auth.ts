// ** Hooks **
import { useCurrentUser } from '@/entities/auth';

export function useAuth() {
  const { user, isPending, isAuth } = useCurrentUser();

  return {
    user,
    isLoading: isPending,
    isAuthenticated: isAuth,
  };
}
