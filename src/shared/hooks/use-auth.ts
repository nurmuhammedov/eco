// ** Hooks **
import { useCurrentUser } from '@/entities/auth/models/auth.fetcher'

export function useAuth() {
  const { user, isPending, isAuth } = useCurrentUser()

  return {
    user,
    isLoading: isPending,
    isAuthenticated: isAuth,
  }
}
