import { ComponentType } from 'react';
import { UserRoles } from '@/entities/user';
import { RouteObject } from 'react-router-dom';

export type AppRoute2 = RouteObject & {
  meta?: {
    roles?: UserRoles[];
    directions?: string[];
    isPublic?: boolean;
    restricted?: boolean;
  };
};

export type RouteMeta = {
  isPublic?: boolean;
  roles?: UserRoles[];
  directions?: string[];
  authRequired?: boolean;
};

export type AppRoute = RouteObject & {
  meta: RouteMeta;
  children?: AppRoute[];
  element: ComponentType;
};

export type RoutesConfig = AppRoute[];
