import { UserRoles } from '@/entities/user';
import adminNavigation from './admin';
import chairmanNavigation from './chairman';
import headNavigation from './head';
import inspectorNavigation from './inspector';
import managerNavigation from './manager';
import regionalUserNavigation from './regional-user';
import userNavigation from './user';

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.LEGAL]: userNavigation,
  [UserRoles.INDIVIDUAL]: userNavigation,
  [UserRoles.CHAIRMAN]: chairmanNavigation,
  [UserRoles.HEAD]: headNavigation,
  [UserRoles.INSPECTOR]: inspectorNavigation,
  [UserRoles.MANAGER]: managerNavigation,
  [UserRoles.REGIONAL]: regionalUserNavigation,
};
