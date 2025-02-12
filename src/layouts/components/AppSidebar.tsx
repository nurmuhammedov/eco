// ** Utils **
import { cn } from '@/shared/lib/utils';

// ** Secondary Components **
import { AppLogo } from './AppLogo';
import { MenuItems } from './MenuItems';

// ** SVG Icons **
import { TechnocorpLogo } from '@/shared/components/SVGIcons';

// ** UI components **
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';

function Footer() {
  return (
    <SidebarFooter className="py-4 px-3 border-t border-neutral-200/20">
      <SidebarMenu>
        <SidebarMenuItem>
          <TechnocorpLogo />
          <p className="text-xm font-normal">tomonidan ishlab chiqilgan</p>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const sidebarOpen = state === 'expanded';
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader
            className={cn({
              'border-b border-neutral-200/20': sidebarOpen,
            })}
          >
            <AppLogo />
          </SidebarHeader>
          <SidebarGroupContent>
            <MenuItems />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {sidebarOpen ? <Footer /> : null}
    </Sidebar>
  );
}
