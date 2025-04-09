import { UserRoles } from './types';
import { PERMISSIONS } from '@/entities/permission';

export const userRoles = Object.entries(UserRoles).map(([label, value]) => ({
  id: value,
  name: label,
}));

export const userDirections = Object.entries(PERMISSIONS).map(
  ([label, value]) => ({
    value,
    label,
  }),
);
