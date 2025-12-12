import { useCurrentUser } from '@/entities/auth'

import { UserRoles } from '@/entities/user'
import { Loader } from '@/shared/components/common'
import { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface Props extends PropsWithChildren {
  allowedRoles?: UserRoles[]
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { pathname } = useLocation()
  const { isAuth, isPending, user } = useCurrentUser()

  if (isPending) {
    return <Loader isVisible={true} message="loading" />
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
