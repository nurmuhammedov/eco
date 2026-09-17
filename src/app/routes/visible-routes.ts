import { APP_ROUTES, AppRouteDefinition } from '@/app/routes/registry'
import { Direction, UserRoles, UserState } from '@/shared/types/user'

/** Directions gate which modules a user can reach; these two are available to everyone. */
export const ALWAYS_ALLOWED_ROUTE_IDS = new Set(['INQUIRY', 'REPORT'])

type RouteViewer = Pick<UserState, 'role' | 'directions'>

/** Two gates: the cabinet the page belongs to, then the direction on the user. */
export const isRouteVisible = ({ roles, id }: Pick<AppRouteDefinition, 'roles' | 'id'>, user: RouteViewer) => {
  if (!roles.includes(user.role)) return false
  if (!id || user.role === UserRoles.ADMIN) return true

  return ALWAYS_ALLOWED_ROUTE_IDS.has(id) || user.directions.includes(id as Direction)
}

export const visibleRoutes = (user: RouteViewer) => APP_ROUTES.filter((route) => isRouteVisible(route, user))
