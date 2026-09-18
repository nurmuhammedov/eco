import { APP_ROUTES, AppRouteDefinition } from '@/app/routes/registry'
import { canOpenModule } from '@/shared/lib/access/module-access'
import { UserState } from '@/shared/types/user'

type RouteViewer = Pick<UserState, 'role' | 'directions'>

/** Two gates: the cabinet the page belongs to, then the module behind it. */
export const isRouteVisible = ({ roles, id }: Pick<AppRouteDefinition, 'roles' | 'id'>, user: RouteViewer) =>
  roles.includes(user.role) && canOpenModule(id, user)

export const visibleRoutes = (user: RouteViewer) => APP_ROUTES.filter((route) => isRouteVisible(route, user))
