import { UserRoles } from '@/entities/user';
import adminNavigation from './admin';
import regionalUserNavigation from './regional-user';
import userNavigation from './user';

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.LEGAL]: userNavigation,
  [UserRoles.INDIVIDUAL]: userNavigation,
  [UserRoles.CHAIRMAN]: userNavigation,
  [UserRoles.HEAD]: userNavigation,
  [UserRoles.INSPECTOR]: userNavigation,
  [UserRoles.MANAGER]: userNavigation,
  [UserRoles.REGIONAL]: regionalUserNavigation,
};
