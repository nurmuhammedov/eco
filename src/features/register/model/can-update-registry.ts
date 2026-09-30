import { UserRoles } from '@/shared/types/user'

/**
 * Registry records an inspector may not edit directly - the change has to go
 * through a request instead.
 */
const INSPECTOR_LOCKED_TYPES = ['HF']

/** Organisations and citizens may edit only these of their records for now */
const OWNER_ROLES = [UserRoles.LEGAL, UserRoles.INDIVIDUAL]
const OWNER_EDITABLE_TYPES = ['HF']

export const canUpdateRegistryType = (type?: string | null, role?: UserRoles) => {
  const registryType = String(type ?? '').toUpperCase()

  if (role === UserRoles.INSPECTOR && INSPECTOR_LOCKED_TYPES.includes(registryType)) return false
  if (role && OWNER_ROLES.includes(role) && !OWNER_EDITABLE_TYPES.includes(registryType)) return false

  return true
}
