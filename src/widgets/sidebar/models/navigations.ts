import { UserRoles } from '@/entities/user';
import adminNavigation from './admin';
import allNavigation from './all';
import legalNavigation from './legal';

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.LEGAL]: legalNavigation,
  [UserRoles.INDIVIDUAL]: allNavigation,
  [UserRoles.CHAIRMAN]: allNavigation,
  [UserRoles.HEAD]: allNavigation,
  [UserRoles.INSPECTOR]: allNavigation,
  [UserRoles.MANAGER]: allNavigation,
  [UserRoles.REGIONAL]: allNavigation,
};
