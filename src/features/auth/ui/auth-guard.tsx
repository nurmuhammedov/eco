import { useCurrentUser } from '@/entities/auth'

import { UserRoles } from '@/entities/user'
import { Loader } from '@/shared/components/common'
import { PropsWithChildren, useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { apiConfig } from '@/shared/api/constants'

interface Props extends PropsWithChildren {
  allowedRoles?: UserRoles[]
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuth, isPending, user } = useCurrentUser()
  const apiUrl = apiConfig.oneIdClientId
  let redirectPath

  useEffect(() => {
    if (
      !isPending &&
      !isAuth &&
      !(
        pathname == '/auth/login/admin' ||
        pathname == '/auth/login' ||
        pathname == '/auth/login/admin/' ||
        pathname == '/auth/login/'
      )
    ) {
      if (apiUrl === 'test_cirns_uz') {
        redirectPath = '/auth/login/admin'
      } else {
        redirectPath = '/auth/login'
      }

      navigate(redirectPath, {
        replace: true,
      })
    }
  }, [isPending, isAuth])

  if (isPending) {
    return <Loader isVisible message="loading" />
  }

  if (user && allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/not-found" replace />
  }

  if (
    isAuth ||
    pathname == '/auth/login/admin' ||
    pathname == '/auth/login' ||
    pathname == '/auth/login/admin/' ||
    pathname == '/auth/login/'
  )
    return children
}
