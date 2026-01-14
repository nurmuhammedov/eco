import { UserRoles } from '@/entities/user'
import adminNavigation from './admin'
import allNavigation from './all'
import legalNavigation from './legal'
import chairmanNavigation from './chairman'

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.LEGAL]: legalNavigation,
  [UserRoles.INDIVIDUAL]: allNavigation,
  [UserRoles.CHAIRMAN]: chairmanNavigation,
  [UserRoles.HEAD]: allNavigation,
  [UserRoles.INSPECTOR]: allNavigation,
  [UserRoles.MANAGER]: allNavigation,
  [UserRoles.REGIONAL]: allNavigation,
}
