import { UserRoles } from '@/entities/user';
import adminNavigation from './admin';
import allNavigation from './all';

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.LEGAL]: allNavigation,
  [UserRoles.INDIVIDUAL]: allNavigation,
  [UserRoles.CHAIRMAN]: allNavigation,
  [UserRoles.HEAD]: allNavigation,
  [UserRoles.INSPECTOR]: allNavigation,
  [UserRoles.MANAGER]: allNavigation,
  [UserRoles.REGIONAL]: allNavigation,
};
