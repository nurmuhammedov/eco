import { Direction, UserRoles } from './types';

export const userRoles = Object.entries(UserRoles).map(([label, value]) => ({
  id: value,
  name: label,
}));

export const userDirections = Object.entries(Direction).map(
  ([label, value]) => ({
    value,
    label,
  }),
);
