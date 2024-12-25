import { RouteObject } from 'react-router-dom';

export type AppRoute = RouteObject & {
  meta?: {
    roles?: string[];
    permissions?: string[];
    isPublic?: boolean;
    restricted?: boolean;
  };
};
