import { UserRoles } from './types'

export const userRoles = Object.entries(UserRoles).map(([label, value]) => ({
  id: value,
  name: label,
}))
