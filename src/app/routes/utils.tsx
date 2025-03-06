import { lazy } from 'react';
import { UserRoles } from '@/shared/types';
import type { AppRoute } from '@/app/routes';
import { useAuth } from '@/shared/hooks/use-auth.ts';

const UnAuthorized = lazy(() => import('@/features/auth/ui/unauthorized.tsx'));

export const DefaultRoute = '/app/applications';

const hasAccess = (
  userRole: UserRoles,
  permissionList: string[],
  meta?: AppRoute['meta'],
): boolean => {
  if (!meta) return true;

  const { roles, permissions } = meta;
  const roleMatch = roles ? roles.includes(userRole) : true;
  const permissionMatch = permissions
    ? permissions.some((perm) => permissionList.includes(perm))
    : true;

  return roleMatch && permissionMatch;
};

export const filterRoutesByAuth = (routes: AppRoute[]): AppRoute[] => {
  const { user } = useAuth();

  if (!user) {
    return routes.map((route) =>
      route.meta?.restricted ? { ...route, element: <UnAuthorized /> } : route,
    );
  }

  return routes.map((route) =>
    hasAccess(user.role, user.permissions, route.meta)
      ? route
      : { ...route, element: <UnAuthorized /> },
  );
};

const roleHomeRoutes: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: '/app/admin/districts',
  [UserRoles.LEGAL]: DefaultRoute,
  [UserRoles.INSPECTOR]: DefaultRoute,
  [UserRoles.REGIONAL]: DefaultRoute,
  [UserRoles.CHAIRMAN]: DefaultRoute,
  [UserRoles.HEAD]: DefaultRoute,
  [UserRoles.MANAGER]: DefaultRoute,
  [UserRoles.INDIVIDUAL]: DefaultRoute,
};

export const getHomeRouteForLoggedInUser = (role: UserRoles) =>
  roleHomeRoutes[role] || '/';

export const getHomeRoute = () => {
  const { user } = useAuth();

  return user ? getHomeRouteForLoggedInUser(user.role) : '/auth/login';
};
