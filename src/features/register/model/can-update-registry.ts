import { UserRoles } from '@/entities/user'

/**
 * Registry records an inspector may not edit directly - the change has to go
 * through a request instead.
 */
const INSPECTOR_LOCKED_TYPES = ['HF', 'ATTRACTION', 'CRANE', 'AUTO_CRANE']

export const canUpdateRegistryType = (type?: string | null, role?: UserRoles) =>
  !(role === UserRoles.INSPECTOR && INSPECTOR_LOCKED_TYPES.includes(String(type ?? '').toUpperCase()))
