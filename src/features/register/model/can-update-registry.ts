import { UserRoles } from '@/shared/types/user'

/**
 * Registry records an inspector may not edit directly - the change has to go
 * through a request instead.
 */
const INSPECTOR_LOCKED_TYPES = ['HF', 'ATTRACTION', 'CRANE', 'AUTO_CRANE']

/** Registries other than the equipment one; any other type here is a device */
const NON_EQUIPMENT_TYPES = ['HF', 'IRS', 'XRAY']

/** Organisations and citizens may not edit their own devices for now */
const EQUIPMENT_LOCKED_ROLES = [UserRoles.LEGAL, UserRoles.INDIVIDUAL]

export const canUpdateRegistryType = (type?: string | null, role?: UserRoles) => {
  const registryType = String(type ?? '').toUpperCase()

  if (role === UserRoles.INSPECTOR && INSPECTOR_LOCKED_TYPES.includes(registryType)) return false
  if (role && EQUIPMENT_LOCKED_ROLES.includes(role) && !NON_EQUIPMENT_TYPES.includes(registryType)) return false

  return true
}
