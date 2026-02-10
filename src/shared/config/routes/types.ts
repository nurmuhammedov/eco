import React, { ComponentType, PropsWithChildren } from 'react'
import { UserRoles } from '@/entities/user'

export interface RouteConfig {
  id?: string
  path: string
  roles?: UserRoles[]
  children?: RouteConfig[]
  component?: ComponentType<any>
  element?: React.ReactNode
}

export interface AuthGuardProps extends PropsWithChildren {
  allowedRoles?: UserRoles[]
}
