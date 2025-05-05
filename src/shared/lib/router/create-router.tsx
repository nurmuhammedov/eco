import { Loader } from '@/shared/components/common';
import React, { LazyExoticComponent, Suspense } from 'react';
import { RouterErrorBoundary } from '@/widgets/error-boundary';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import { appRoutes, AuthGuardProps, authRoutes, RouteConfig, specialComponents } from '@/shared/config/routes';

/**
 * Suspense bilan o'ralgan component yaratish uchun funksiya
 * @param Component - Ko'rsatiladigan component
 * @returns Suspense bilan o'ralgan component
 */
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loader isVisible />}>
    <Component />
  </Suspense>
);

/**
 * Protected route yaratish uchun funksiya
 * @param routeConfig - Route konfiguratsiyasi
 * @param AuthGuard - Authenticationni tekshiruvchi component
 * @returns RouteObject - Protected route
 */
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

/**
 * Authentication routelari uchun funksiya
 * @param routeConfig - Route konfiguratsiyasi
 * @returns RouteObject - Authentication route
 */
export const createAuthRoute = (routeConfig: RouteConfig): RouteObject => {
  const { component: Component, path } = routeConfig;

  return {
    path,
    element: withSuspense(Component),
  };
};

/**
 * Asosiy router yaratish uchun funksiya
 * @param AppLayout - Asosiy dastur layouti
 * @param AuthLayout - Authentication layouti
 * @param AuthGuard - Autentifikatsiya tekshiruvchi component
 * @returns Router - Tayyor router
 */
export const createAppRouter = (
  AppLayout: LazyExoticComponent<React.ComponentType>,
  AuthLayout: LazyExoticComponent<React.ComponentType>,
  AuthGuard: React.ComponentType<AuthGuardProps>,
) => {
  const protectedRoutes = appRoutes.map((route) => createProtectedRoute(route, AuthGuard));
  const publicRoutes = authRoutes.map(createAuthRoute);

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
      children: publicRoutes,
    },
    {
      path: '*',
      element: withSuspense(specialComponents.notFound),
    },
  ];

  return createBrowserRouter(routerConfig);
};
