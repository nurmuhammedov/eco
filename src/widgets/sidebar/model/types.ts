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
    /** Pages that belong to this entry without sitting at its address, e.g. the reports of a section */
    activeUrls?: string[]
  }[]
}

export type Navigation = NavigationItem[]
