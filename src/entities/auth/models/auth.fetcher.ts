import { authAPI } from '@/entities/auth/models/auth.api'
import { LoginDTO } from '@/entities/auth/models/auth.types'
import { UserState } from '@/entities/user'
import { goToGuestLanding } from '@/shared/config/navigation'
import { routeByRole } from '@/shared/lib/router/route-by-role'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export const CURRENT_USER_QUERY_KEY = ['me'] as const

export const useCurrentUser = () => {
  const {
    data: user,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: authAPI.getMe,
    retry: 0,
    staleTime: Infinity,
    refetchOnMount: false,
  })

  return { user, error, isPending, isSuccess, isAuth: Boolean(user) && !error }
}

const resolveRedirectPath = (from: string | undefined, user: UserState) =>
  from && from !== '/' ? from : routeByRole(user?.role)

export const useLogin = () => {
  const queryClient = useQueryClient()
  const { state } = useLocation()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginDTO) => authAPI.login(data),
    onSuccess: (user: UserState) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user)
      navigate(resolveRedirectPath(state?.from, user), { replace: true })
    },
  })
}

interface UseLoginOneIdOptions {
  disableAutoRun?: boolean
  customRedirect?: (data: UserState) => void
}

export const useLoginOneId = (options?: UseLoginOneIdOptions) => {
  const { state, pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const code = useMemo(() => searchParams.get('code') ?? undefined, [searchParams])

  // OneID codes are single-use, so remember the one already sent: StrictMode runs the effect twice.
  const processedCode = useRef<string | null>(null)

  const {
    mutate: handleLoginOneId,
    isPending,
    isError,
    reset,
  } = useMutation({
    retry: false,
    mutationFn: authAPI.loginOneId,
    onSuccess: (user: UserState) => {
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, user)

      if (options?.customRedirect) {
        options.customRedirect(user)
        return
      }

      navigate(resolveRedirectPath(state?.from, user), { replace: true })
    },
    // Drop the code from the URL so a page refresh does not replay a failed exchange.
    onError: () => navigate(pathname, { replace: true, state }),
  })

  useEffect(() => {
    if (options?.disableAutoRun || !code || processedCode.current === code) return

    processedCode.current = code
    handleLoginOneId(code)
  }, [code, options?.disableAutoRun, handleLoginOneId])

  return { isPending, isError, reset, mutate: handleLoginOneId }
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authAPI.logout,
    // Sign the user out even if the request fails; a full navigation clears in-memory state.
    onSettled: () => {
      queryClient.clear()
      goToGuestLanding()
    },
  })
}

// Re-reads the new role, lands on its start page and drops data cached under the previous role.
const useRoleSwitch = <TVariables>(mutationFn: (variables: TVariables) => Promise<unknown>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      const user = await queryClient.fetchQuery({
        queryKey: CURRENT_USER_QUERY_KEY,
        queryFn: authAPI.getMe,
        staleTime: 0,
      })

      navigate(routeByRole(user?.role), { replace: true })
      await queryClient.invalidateQueries({ predicate: ({ queryKey }) => queryKey[0] !== 'me' })
    },
  })
}

export const useSwitchOtherRole = () => useRoleSwitch<string>(authAPI.switchOther)

export const useSwitchBackRole = () => useRoleSwitch<void>(authAPI.switchBack)
