import { UserRoles } from '@/entities/user'

export const routeByRole = (role: UserRoles | undefined | null): string => {
  switch (role) {
    case UserRoles.REGIONAL:
    case UserRoles.INSPECTOR:
    case UserRoles.CHAIRMAN:
      return '/dashboard'
    case UserRoles.LEGAL:
    case UserRoles.INDIVIDUAL:
      return '/applications'
    case UserRoles.ADMIN:
      return '/territories'
    default:
      return '/applications'
  }
}
