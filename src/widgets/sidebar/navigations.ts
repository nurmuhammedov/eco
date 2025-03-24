import userNavigation from './user';
import adminNavigation from './admin';
import { UserRoles } from '@/shared/types';

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.LEGAL]: userNavigation,
  [UserRoles.INDIVIDUAL]: userNavigation,
  [UserRoles.CHAIRMAN]: [],
  [UserRoles.HEAD]: [],
  [UserRoles.INSPECTOR]: [],
  [UserRoles.MANAGER]: [],
  [UserRoles.REGIONAL]: [],
};
