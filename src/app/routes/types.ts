import React, { ComponentType } from 'react'
import { UserRoles } from '@/entities/user'

export interface RouteConfig {
  id?: string
  path: string
  roles?: UserRoles[]
  children?: RouteConfig[]
  component?: ComponentType<any>
  element?: React.ReactNode
}
