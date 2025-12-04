import { TFunction } from 'i18next'
import { UserRoles } from '@/entities/user'

export const getUserRoleDisplay = (
  role: UserRoles | string | null | undefined,
  translateFn: TFunction,
  includeOriginal: boolean = false,
  fallback: string = ''
): string => {
  if (!role) {
    return fallback
  }

  const isValidRole = Object.values(UserRoles).includes(role as UserRoles)

  if (!isValidRole) {
    return fallback
  }

  const userRole = role as UserRoles

  const translatedRole = translateFn(`userRoles.${userRole}`, {
    defaultValue: fallback || userRole,
  })

  if (includeOriginal) {
    return `${translatedRole} (${userRole})`
  }

  return translatedRole
}
