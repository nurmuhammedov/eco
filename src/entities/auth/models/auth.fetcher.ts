import { setUser } from '@/app/store/auth-slice'
import { authAPI } from '@/entities/auth/models/auth.api'
import { LoginDTO } from '@/entities/auth/models/auth.types'
import { UserState } from '@/entities/user'
import { useAppDispatch } from '@/shared/hooks/use-store'
import { routeByRole } from '@/shared/lib/router/route-by-role'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { apiConfig } from '@/shared/api/constants'

export const useCurrentUser = () => {
  const {
    data: user,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: async () => authAPI.getMe(),
    retry: 0,
    staleTime: Infinity,
  })

  return { user, error, isPending, isSuccess, isAuth: user && !error }
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  return useMutation({
    mutationFn: async (data: LoginDTO) => authAPI.login(data),

    onSuccess: (data: UserState) => {
      dispatch(setUser(data))
      queryClient.setQueryData(['me'], data)
      const redirectPath = state?.from && state?.from !== '/' ? state?.from : routeByRole(data?.role)
      navigate(redirectPath)
    },
  })
}

export const useLoginOneId = () => {
  const { state } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const resolvedParams = useMemo(() => Object.fromEntries(searchParams), [searchParams])
  const { mutate: handleLoginOneId } = useMutation({
    retry: false,
    mutationFn: authAPI.loginOneId,
    onSuccess: (data: UserState) => {
      dispatch(setUser(data))
      queryClient.setQueryData(['me'], data)
      const redirectPath = state?.from && state?.from !== '/' ? state?.from : routeByRole(data?.role)
      navigate(redirectPath)
    },
  })

  useEffect(() => {
    if (resolvedParams.code) handleLoginOneId(resolvedParams.code)
  }, [resolvedParams.code])
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const apiUrl = apiConfig.oneIdClientId

  let redirectPath
  if (apiUrl === 'test_cirns_uz') {
    redirectPath = '/auth/login/admin'
  } else {
    redirectPath = '/home'
  }
  return useMutation({
    mutationFn: async () => authAPI.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] })
      queryClient.removeQueries({ queryKey: ['currentUser'] })
      navigate(redirectPath)
    },
  })
}
