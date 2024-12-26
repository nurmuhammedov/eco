import { RouteObject } from 'react-router-dom';
import { UserRoles } from '@/shared/types';

export type AppRoute = RouteObject & {
  meta?: {
    roles?: UserRoles[];
    permissions?: string[];
    isPublic?: boolean;
    restricted?: boolean;
  };
};
