import { useQuery } from '@tanstack/react-query'
import { SESSION_QUERY_KEY, fetchCurrentUser } from '@/shared/api/session'

export function useAuth() {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: 0,
    staleTime: Infinity,
    refetchOnMount: false,
  })

  return {
    user,
    isLoading: isPending,
    isAuthenticated: Boolean(user) && !error,
  }
}
