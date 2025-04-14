import React, { Suspense } from 'react';
import { Loader } from '@/shared/components/common';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import RouterErrorBoundary from '@/widgets/error-boundary/ui/router-error-boundary';
import { appRoutes, AuthGuardProps, authRoutes, RouteConfig, specialComponents } from '@/shared/config/routes';

export const createProtectedRoute = (
  routeConfig: RouteConfig,
  AuthGuard: React.ComponentType<AuthGuardProps>,
): RouteObject => {
  const { component: Component, roles, path } = routeConfig;

  const routeObject: RouteObject = {
    path,
    element: (
      <AuthGuard allowedRoles={roles}>
        <RouterErrorBoundary>
          <Suspense fallback={<Loader isVisible />}>
            <Component />
          </Suspense>
        </RouterErrorBoundary>
      </AuthGuard>
    ),
  };

  if (routeConfig.children && routeConfig.children.length > 0) {
    routeObject.children = routeConfig.children.map((child) => createProtectedRoute(child, AuthGuard));
  }

  return routeObject;
};

export const createAuthRoute = (routeConfig: RouteConfig): RouteObject => {
  const { component: Component, path } = routeConfig;

  return {
    path,
    element: (
      <Suspense fallback={<Loader isVisible />}>
        <Component />
      </Suspense>
    ),
  };
};

export const createAppRouter = (
  AppLayout: React.LazyExoticComponent<any>,
  AuthLayout: React.LazyExoticComponent<any>,
  AuthGuard: React.ComponentType<AuthGuardProps>,
) => {
  const protectedRoutes = appRoutes.map((route) => createProtectedRoute(route, AuthGuard));

  const publicRoutes = authRoutes.map(createAuthRoute);

  return createBrowserRouter([
    {
      path: '/',
      element: (
        <Suspense fallback={<Loader isVisible />}>
          <AppLayout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/applications" replace />,
        },
        ...protectedRoutes,
        {
          path: 'unauthorized',
          element: (
            <Suspense fallback={<Loader isVisible />}>
              <specialComponents.unauthorized />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '/auth',
      element: (
        <Suspense fallback={<Loader isVisible />}>
          <AuthLayout />
        </Suspense>
      ),
      children: publicRoutes,
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<Loader isVisible />}>
          <specialComponents.notFound />
        </Suspense>
      ),
    },
  ]);
};
