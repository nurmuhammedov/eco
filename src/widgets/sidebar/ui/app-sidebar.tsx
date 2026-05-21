import { Book, LucideHome } from 'lucide-react'
import { Direction, UserRoles } from '@/entities/user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

    let navigations: any[] = []

    if (user.role == UserRoles.ADMIN) {
      navigations = NAVIGATIONS[user.role]
    } else if (user.role == UserRoles.LEGAL) {
      navigations = legalNavigation.filter((navItem) => user.directions.includes(navItem.id as Direction))
    } else if (user.directions.length === 0) {
      const appealNav = allNavigation.find((item: any) => item.id === 'APPEAL')
      const inquiryNav = allNavigation.find((item: any) => item.id === 'INQUIRY')

      navigations = []
      if (appealNav) navigations.push(appealNav)
      if (inquiryNav && user.role === UserRoles.INDIVIDUAL) navigations.push(inquiryNav)
    } else {
      const baseNavigation = NAVIGATIONS[user.role] || allNavigation

      navigations = baseNavigation.reduce((acc: any[], navItem: any) => {
        if (navItem.items?.length) {
          const filteredItems = navItem.items.filter((subItem: any) =>
            subItem.id ? user.directions.includes(subItem.id as Direction) : false
          )

          if (filteredItems.length > 0) {
            acc.push({ ...navItem, items: filteredItems })
          }
        } else if (
          user.directions.includes(navItem.id as Direction) ||
          (user.role === UserRoles.INDIVIDUAL && navItem.id === 'INQUIRY')
        ) {
          acc.push(navItem)
        }

        return acc
      }, [])
    }

    if (user.role === UserRoles.REGIONAL || user.role === UserRoles.INSPECTOR || user.role === UserRoles.CHAIRMAN) {
      navigations = [
        {
          title: 'Bosh sahifa',
          url: '/dashboard',
          icon: <LucideHome />,
        },
        ...navigations,
      ]
    }

    const staticIds = ['REPORT', 'INQUIRY']
    navigations = navigations.filter((nav) => !staticIds.includes(nav.id))
    const staticNavs = allNavigation.filter((nav: any) => staticIds.includes(nav.id))
    navigations = [...navigations, ...staticNavs]

    return navigations
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Kutubxona">
              <a href="https://edu.ktnu.uz/library" target="_blank" rel="noopener noreferrer">
                <Book />
                <span>Kutubxona</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
