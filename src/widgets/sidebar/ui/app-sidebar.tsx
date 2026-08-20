import { Book } from 'lucide-react'
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

import { useUserNavigation } from '@/widgets/sidebar/models/use-user-navigation'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { useAuth } from '@/shared/hooks/use-auth'
import { AppLogo } from './app-logo'

export function AppSidebar() {
  const { user } = useAuth()
  const navigations = useUserNavigation()

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
            {navigations.map((item) => (
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
