import { UserRoles } from '@/entities/user';

export const DefaultRoute = '/applications';

const roleHomeRoutes: Record<UserRoles, string> = {
  [UserRoles.ADMIN]: '/territories',
  [UserRoles.LEGAL]: DefaultRoute,
  [UserRoles.INSPECTOR]: DefaultRoute,
  [UserRoles.REGIONAL]: DefaultRoute,
  [UserRoles.CHAIRMAN]: DefaultRoute,
  [UserRoles.HEAD]: DefaultRoute,
  [UserRoles.MANAGER]: DefaultRoute,
  [UserRoles.INDIVIDUAL]: DefaultRoute,
};

export const getHomeRouteForLoggedInUser = (role: UserRoles) => roleHomeRoutes[role] || '/';
