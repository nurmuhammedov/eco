import { UserRoles } from '@/shared/types';
import { RouteObject } from 'react-router-dom';

export type AppRoute = RouteObject & {
  meta?: {
    roles?: UserRoles[];
    permissions?: string[];
    isPublic?: boolean;
    restricted?: boolean;
  };
};
