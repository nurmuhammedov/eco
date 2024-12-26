import { lazy } from 'react';
import { UserRoles } from '@/shared/types';
import type { AppRoute } from '@/app/routes';

const UnAuthorized = lazy(() => import('@/modules/auth/pages/unauthorized'));

export const DefaultRoute = '/app';

export const filterRoutesByAuth = (
  routes: AppRoute[],
  roles: UserRoles[],
  permissions: string[],
  isAuthenticated: boolean,
): AppRoute[] => {
  return routes.map((route) => {
    if (route.meta?.isPublic) return route; // Public routes
    if (!isAuthenticated && route.meta?.restricted) {
      return {
        ...route,
        element: <UnAuthorized />,
      };
    }

    // Role-based filtering
    if (
      route.meta?.roles &&
      !route.meta?.roles.some((role: UserRoles) => roles.includes(role))
    ) {
      return {
        ...route,
        element: <UnAuthorized />,
      };
    }

    // Permission-based filtering
    if (
      route.meta?.permissions &&
      !route.meta?.permissions.some((permission: string) =>
        permissions.includes(permission),
      )
    ) {
      return {
        ...route,
        element: <UnAuthorized />, // Redirect to Unauthorized
      };
    }

    return route;
  });
};

export const getHomeRouteForLoggedInUser = (role: UserRoles) => {
  if (role === UserRoles.ADMIN) {
    return DefaultRoute;
  }
  return '/';
};

export const getHomeRoute = () => {
  const user = true;

  if (user) {
    return getHomeRouteForLoggedInUser(UserRoles.ADMIN); // user.role berilishi kerak
  }
  return '/login';
};
