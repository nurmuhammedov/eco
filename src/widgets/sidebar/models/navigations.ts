import userNavigation from './user.ts';
import adminNavigation from './admin.ts';
import { UserRoles } from '@/entities/user';

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
