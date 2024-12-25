import type { AppRoute } from '@/app/routes';
import { moduleRoutes } from '@/app/routes';
import Unauthorized from '@/modules/auth/pages/unauthorized.tsx';

export const filterRoutesByAuth = (
  routes: AppRoute[],
  roles: string[],
  permissions: string[],
  isAuthenticated: boolean,
): AppRoute[] => {
  return routes.map((route) => {
    if (route.meta?.isPublic) return route; // Public routes
    if (!isAuthenticated && route.meta?.restricted) {
      return {
        ...route,
        element: <Unauthorized />, // Redirect to Unauthorized
      };
    }

    // Role-based filtering
    if (
      route.meta?.roles &&
      !route.meta?.roles.some((role) => roles.includes(role))
    ) {
      return {
        ...route,
        element: <Unauthorized />, // Redirect to Unauthorized
      };
    }

    // Permission-based filtering
    if (
      route.meta?.permissions &&
      !route.meta?.permissions.some((permission) =>
        permissions.includes(permission),
      )
    ) {
      return {
        ...route,
        element: <Unauthorized />, // Redirect to Unauthorized
      };
    }

    return route;
  });
};

export const useDynamicRoutes = () => {
  // const { roles, permissions, isAuthenticated } = useAuth();
  return filterRoutesByAuth(moduleRoutes, ['admin'], ['dashboard'], true);
};
