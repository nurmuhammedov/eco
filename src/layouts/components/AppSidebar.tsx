import { AppLogo } from './AppLogo';
import { MenuItems } from './MenuItems';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@/shared/components/ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader>
            <AppLogo />
          </SidebarHeader>
          <SidebarGroupContent>
            <MenuItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
