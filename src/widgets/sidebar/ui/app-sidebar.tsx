import { Direction, UserRoles } from '@/entities/user'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/shared/components/ui/sidebar'

import { NAVIGATIONS } from '@/widgets/sidebar/models/navigations'
import { Navigation } from '@/widgets/sidebar/models/types'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { useMemo } from 'react'
import allNavigation from '../models/all'
import legalNavigation from '../models/legal'

import { AppLogo } from './app-logo'
import { useAuth } from '@/shared/hooks/use-auth'

export function AppSidebar() {
  const { user } = useAuth()
  const displayedNavigations: Navigation = useMemo(() => {
    if (!user) return []

    if (user.role == UserRoles.ADMIN) {
      return NAVIGATIONS[user.role]
    }

    if (user.directions.length === 0) {
      const appealNav = allNavigation.find((item: any) => item.id === 'APPEAL')
      return appealNav ? [appealNav] : []
    }

    if (user.role == UserRoles.LEGAL) {
      return legalNavigation.filter((navItem) => user.directions.includes(navItem.id as Direction))
    }

    const baseNavigation = NAVIGATIONS[user.role] || allNavigation

    return baseNavigation.reduce((acc: any[], navItem: any) => {
      if (navItem.items?.length) {
        const filteredItems = navItem.items.filter((subItem: any) =>
          subItem.id ? user.directions.includes(subItem.id as Direction) : false
        )

        if (filteredItems.length > 0) {
          acc.push({ ...navItem, items: filteredItems })
        }
      } else if (user.directions.includes(navItem.id as Direction)) {
        acc.push(navItem)
      }

      return acc
    }, [])
  }, [user])

  if (!user) return null

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarGroup className="border-b p-0">
          <AppLogo />
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-1">
            {displayedNavigations.map((item) => (
              <NavMain key={item.title} item={item} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
