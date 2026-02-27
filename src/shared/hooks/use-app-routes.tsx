import {
  adminRoutes,
  chairmanRoutes,
  headRoutes,
  individualRoutes,
  inspectorRoutes,
  legalRoutes,
  managerRoutes,
  regionalRoutes,
} from '@/shared/config/routes/roles'
import { authRoutes, publicRoutes, specialComponents } from '@/shared/config/routes'
import { useAuth } from '@/shared/hooks/use-auth'
import { routeByRole } from '@/shared/lib/router/route-by-role'
import { Direction, UserRoles } from '@/entities/user'
import { apiConfig } from '@/shared/api/constants'
import React, { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { Loader } from '@/shared/components/common'

const AppLayout = lazy(() => import('@/shared/layouts/ui/app-layout'))
const AuthLayout = lazy(() => import('@/shared/layouts/ui/auth-layout'))

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader isVisible />}>
    <Component />
  </Suspense>
)

export const useAppRoutes = () => {
  const { user, isLoading } = useAuth()

  // Removed early return to prevent Hook order error

  const filterRoutesByDirection = (routes: any[]) => {
    if (!user) return []
    if (user.role === UserRoles.ADMIN) return routes

    return routes.filter((route) => {
      if (!route.id) return true
      return user.directions.includes(route.id as Direction)
    })
  }

  const getRoleRoutes = (role: UserRoles) => {
    let routes: any[]
    switch (role) {
      case UserRoles.ADMIN:
        routes = adminRoutes
        break
      case UserRoles.LEGAL:
        routes = legalRoutes
        break
      case UserRoles.REGIONAL:
        routes = regionalRoutes
        break
      case UserRoles.INSPECTOR:
        routes = inspectorRoutes
        break
      case UserRoles.CHAIRMAN:
        routes = chairmanRoutes
        break
      case UserRoles.MANAGER:
        routes = managerRoutes
        break
      case UserRoles.HEAD:
        routes = headRoutes
        break
      case UserRoles.INDIVIDUAL:
        routes = individualRoutes
        break
      default:
        routes = []
    }
    return filterRoutesByDirection(routes)
  }

  const roleRoutes = user ? getRoleRoutes(user.role) : []

  const authLayoutChildren = authRoutes.map((route: any) => ({
    path: route.path,
    element: route.element,
  }))

  const routes = {
    authenticated: [
      {
        path: '/',
        element: withSuspense(AppLayout as any),
        children: [
          {
            index: true,
            element: <Navigate to={routeByRole(user?.role)} replace />,
          },
          ...roleRoutes.map((route) => ({
            path: route.path,
            element: route.element,
          })),
        ],
      },
      ...publicRoutes.map((route: any) => ({
        path: route.path,
        element: route.element,
      })),
      {
        path: 'auth/*',
        element: <Navigate to="/" replace />,
      },
      {
        path: '*',
        element: withSuspense(specialComponents.notFound),
      },
    ],
    default: [
      {
        path: 'auth',
        element: withSuspense(AuthLayout as any),
        children: [
          {
            index: true,
            element: (
              <Navigate to={apiConfig.oneIdClientId === 'test_cirns_uz' ? '/auth/login/admin' : '/home'} replace />
            ),
          },
          ...authLayoutChildren,
        ],
      },
      ...publicRoutes.map((route: any) => ({
        path: route.path,
        element: route.element,
      })),
      {
        path: '*',
        element: <Navigate to={apiConfig.oneIdClientId === 'test_cirns_uz' ? '/auth/login/admin' : '/home'} replace />,
      },
    ],
  }

  const routeConfig = isLoading && !user ? [] : user ? routes.authenticated : routes.default
  const element = useRoutes(routeConfig)

  if (isLoading && !user) {
    return <Loader isVisible />
  }

  return element
}
