import React, { ComponentType } from 'react'
import { UserRoles } from '@/shared/types/user'

export interface RouteConfig {
  id?: string
  path: string
  roles?: UserRoles[]
  children?: RouteConfig[]
  component?: ComponentType<any>
  element?: React.ReactNode
}
