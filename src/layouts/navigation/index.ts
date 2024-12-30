import userNavigation from './user';
import adminNavigation from './admin';
import { UserRoles } from '@/shared/types';

export const NAVIGATIONS = {
  [UserRoles.ADMIN]: adminNavigation,
  [UserRoles.USER]: userNavigation,
};
