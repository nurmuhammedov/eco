import { Loader } from '@/shared/components/common';
import React, { LazyExoticComponent, Suspense } from 'react';
import { RouterErrorBoundary } from '@/widgets/error-boundary';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import {
  appRoutes,
  AuthGuardProps,
  authRoutes,
  RouteConfig,
  publicRoutes,
  specialComponents,
} from '@/shared/config/routes';

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader isVisible />}>
    <Component />
  </Suspense>
);

export const createProtectedRoute = (
  routeConfig: RouteConfig,
  AuthGuard: React.ComponentType<AuthGuardProps>,
): RouteObject => {
  const { component: Component, roles, path, children } = routeConfig;

  const routeObject: RouteObject = {
    path,
    element: (
      <AuthGuard allowedRoles={roles}>
        <RouterErrorBoundary>{withSuspense(Component)}</RouterErrorBoundary>
      </AuthGuard>
    ),
  };

  if (children?.length) {
    routeObject.children = children.map((child) => createProtectedRoute(child, AuthGuard));
  }

  return routeObject;
};

export const createAuthRoute = (routeConfig: RouteConfig): RouteObject => {
  const { component: Component, path } = routeConfig;

  return {
    path,
    element: withSuspense(Component),
  };
};

export const createAppRouter = (
  AppLayout: LazyExoticComponent<React.ComponentType>,
  AuthLayout: LazyExoticComponent<React.ComponentType>,
  AuthGuard: React.ComponentType<AuthGuardProps>,
) => {
  const protectedRoutes = appRoutes.map((route) => createProtectedRoute(route, AuthGuard));
  const authLayoutRoutes = authRoutes.map(createAuthRoute);
  const standalonePublicRoutes = publicRoutes.map(createAuthRoute);

  const routerConfig: RouteObject[] = [
    {
      path: '/',
      element: withSuspense(AppLayout),
      children: [
        {
          index: true,
          element: <Navigate to="/applications" replace />,
        },
        ...protectedRoutes,
        {
          path: 'unauthorized',
          element: withSuspense(specialComponents.unauthorized),
        },
      ],
    },
    {
      path: '/auth',
      element: withSuspense(AuthLayout),
      children: authLayoutRoutes,
    },

    ...standalonePublicRoutes,

    {
      path: '*',
      element: withSuspense(specialComponents.notFound),
    },
  ];

  return createBrowserRouter(routerConfig);
};
