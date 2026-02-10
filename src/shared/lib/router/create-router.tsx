import { Loader } from '@/shared/components/common'
import React, { LazyExoticComponent, Suspense } from 'react'
import { RouterErrorBoundary } from '@/widgets/error-boundary'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import { AuthGuardProps, authRoutes, publicRoutes, RouteConfig, specialComponents } from '@/shared/config/routes'
import { useAuth } from '@/shared/hooks/use-auth'

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader isVisible />}>
    <Component />
  </Suspense>
)

export const createProtectedRoute = (
  routeConfig: RouteConfig,
  AuthGuard: React.ComponentType<AuthGuardProps>,
  className?: string
): RouteObject => {
  const { component: Component, element, roles, path, children } = routeConfig

  const content = Component ? withSuspense(Component) : element

  const routeObject: RouteObject = {
    path,
    element: (
      <AuthGuard allowedRoles={roles}>
        <RouterErrorBoundary className={className}>{content}</RouterErrorBoundary>
      </AuthGuard>
    ),
  }

  if (children?.length) {
    routeObject.children = children.map((child) => createProtectedRoute(child, AuthGuard))
  }

  return routeObject
}

export const createAuthRoute = (routeConfig: RouteConfig): RouteObject => {
  const { component: Component, element, path } = routeConfig

  return {
    path,
    element: Component ? withSuspense(Component) : element,
  }
}

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
import { routeByRole } from './route-by-role'
import { Direction, UserRoles } from '@/entities/user'

export const createAppRouter = (
  AppLayout: LazyExoticComponent<React.ComponentType>,
  AuthLayout: LazyExoticComponent<React.ComponentType>,
  AuthGuard: React.ComponentType<AuthGuardProps>
) => {
  const { isAuthenticated, user } = useAuth()

  let roleRoutes: any[] = []

  if (user) {
    switch (user.role) {
      case UserRoles.ADMIN:
        roleRoutes = adminRoutes
        break
      case UserRoles.LEGAL:
        roleRoutes = legalRoutes
        break
      case UserRoles.REGIONAL:
        roleRoutes = regionalRoutes
        break
      case UserRoles.INSPECTOR:
        roleRoutes = inspectorRoutes
        break
      case UserRoles.CHAIRMAN:
        roleRoutes = chairmanRoutes
        break
      case UserRoles.MANAGER:
        roleRoutes = managerRoutes
        break
      case UserRoles.HEAD:
        roleRoutes = headRoutes
        break
      case UserRoles.INDIVIDUAL:
        roleRoutes = individualRoutes
        break
      default:
        roleRoutes = []
    }

    if (user.role !== UserRoles.ADMIN) {
      roleRoutes = roleRoutes.filter((route) => {
        if (route.id) {
          return user.directions.includes(route.id as Direction)
        }
        // If no ID is present on the route, do we show it?
        // Default to showing checks, or should we be strict?
        // In sidebar, main items without ID (if any) might be shown?
        // But sidebar items usually have ID if they are direction-bound.
        // Dashboard has no ID in my impl, but check sidebar logic:
        // if (user.role == REGIONAL...) unshift Dashboard.
        // So Dashboard has no ID.
        // For existing routes in my files:
        // regional.ts: dashboard has no ID. Applications has ID.
        // So if no ID -> Keep it (e.g. Dashboard).
        return true
      })
    }
  }

  const protectedRoutes = roleRoutes.map((route) => createProtectedRoute(route, AuthGuard))
  const authLayoutRoutes = authRoutes.map((route: RouteConfig) =>
    createProtectedRoute(route, AuthGuard, 'flex-1 min-h-screen w-full')
  )
  const standalonePublicRoutes = publicRoutes.map(createAuthRoute)

  const routerConfig: RouteObject[] = [
    {
      path: '/',
      element: withSuspense(AppLayout),
      children: [
        ...(isAuthenticated
          ? [
              {
                index: true,
                element: <Navigate to={routeByRole(user?.role)} replace />,
              },
            ]
          : [
              {
                index: true,
                element: <Navigate to="/auth/login" replace />,
              },
            ]),
        ...protectedRoutes,
      ],
    },
    {
      path: '/auth',
      element: withSuspense(AuthLayout),
      children: authLayoutRoutes,
    },
    ...standalonePublicRoutes,
    ...(isAuthenticated
      ? [
          {
            path: '*',
            element: withSuspense(specialComponents.notFound),
          },
        ]
      : [
          {
            path: '*',
            element: withSuspense(AuthLayout),
            children: authLayoutRoutes,
          },
        ]),
  ]

  return createBrowserRouter(routerConfig)
}
