import { UserRoles } from '@/shared/types/user'

/**
 * The cabinets with a dashboard: it is their start page and the first entry of
 * their menu. The router, the menu and the start page all read this one list;
 * kept as three copies, the router's still let the procurator in (2026-11-10).
 */
export const DASHBOARD_ROLES: readonly UserRoles[] = [UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.CHAIRMAN]

export const routeByRole = (role: UserRoles | undefined | null): string => {
  if (role && DASHBOARD_ROLES.includes(role)) return '/dashboard'

  switch (role) {
    case UserRoles.LEGAL:
    case UserRoles.INDIVIDUAL:
      return '/applications'
    case UserRoles.ADMIN:
      return '/territories'
    case UserRoles.PROCURATOR:
      return '/register'
    case UserRoles.INTERACTIVE_SERVICE:
      return '/interactive-service'
    case UserRoles.ACCOUNTANT:
      return '/inquiries'
    case UserRoles.HR:
      return '/kpi/departments'
    default:
      return '/applications'
  }
}
