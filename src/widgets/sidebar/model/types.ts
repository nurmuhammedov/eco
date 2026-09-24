import { ReactNode } from 'react'

export type NavigationItem = {
  id?: string
  url: string
  title: string
  icon: ReactNode
  isActive?: boolean
  items?: {
    id?: string
    url: string
    title: string
  }[]
}

export type Navigation = NavigationItem[]
