import { ComponentType, PropsWithChildren } from 'react';
import { UserRoles } from '@/entities/user';

export interface RouteConfig {
  path: string;
  roles?: UserRoles[];
  children?: RouteConfig[];
  component: ComponentType<any>;
}

export interface AuthGuardProps extends PropsWithChildren {
  allowedRoles?: UserRoles[];
}
