import { Loader } from '@/shared/components/common'
import React, { LazyExoticComponent, Suspense } from 'react'
import { RouterErrorBoundary } from '@/widgets/error-boundary'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import {
  appRoutes,
  AuthGuardProps,
  authRoutes,
  publicRoutes,
  RouteConfig,
  specialComponents,
} from '@/shared/config/routes'
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
  const { component: Component, roles, path, children } = routeConfig

  const routeObject: RouteObject = {
    path,
    element: (
      <AuthGuard allowedRoles={roles}>
        <RouterErrorBoundary className={className}>{withSuspense(Component)}</RouterErrorBoundary>
      </AuthGuard>
    ),
  }

  if (children?.length) {
    routeObject.children = children.map((child) => createProtectedRoute(child, AuthGuard))
  }

  return routeObject
}

export const createAuthRoute = (routeConfig: RouteConfig): RouteObject => {
  const { component: Component, path } = routeConfig

  return {
    path,
    element: withSuspense(Component),
  }
}

export const createAppRouter = (
  AppLayout: LazyExoticComponent<React.ComponentType>,
  AuthLayout: LazyExoticComponent<React.ComponentType>,
  AuthGuard: React.ComponentType<AuthGuardProps>
) => {
  const { isAuthenticated } = useAuth()
  const protectedRoutes = appRoutes.map((route) => createProtectedRoute(route, AuthGuard))
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
                element: <Navigate to="/applications" replace />,
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
