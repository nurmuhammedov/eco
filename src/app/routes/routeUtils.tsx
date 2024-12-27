import { lazy } from 'react';
import { store } from '@/store';
import { pick } from '@/shared/utils';
import { UserRoles } from '@/shared/types';
import type { AppRoute } from '@/app/routes';

const UnAuthorized = lazy(() => import('@/modules/auth/pages/unauthorized'));

export const DefaultRoute = '/app';

const hasAccess = (
  userRole: UserRoles,
  userPermissions: string[],
  meta: AppRoute['meta'],
): boolean => {
  const roleMatch = meta?.roles ? meta.roles.includes(userRole) : true;
  const permissionMatch = meta?.permissions
    ? meta?.permissions.some((permission) =>
        userPermissions.includes(permission),
      )
    : true;

  return roleMatch && permissionMatch;
};

export const filterRoutesByAuth = (routes: AppRoute[]): AppRoute[] => {
  const { user, isAuthenticated } = pick(store.getState().auth, [
    'isAuthenticated',
    'user',
  ]);

  return routes.map((route) => {
    if (route.meta?.isPublic) return route;

    if (!isAuthenticated && route.meta?.restricted) {
      return { ...route, element: <UnAuthorized /> };
    }

    if (!hasAccess(user.role, user.permissions, route.meta)) {
      return { ...route, element: <UnAuthorized /> };
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
  const { isAuthenticated, user } = pick(store.getState().auth, [
    'isAuthenticated',
    'user',
  ]);

  return isAuthenticated ? getHomeRouteForLoggedInUser(user.role) : '/login';
};
