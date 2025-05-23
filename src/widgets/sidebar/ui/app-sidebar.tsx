// ** Utils **
import { pick } from '@/shared/utils';
import { cn } from '@/shared/lib/utils';
import { shallowEqual } from 'react-redux';
import { NavMain } from '@/widgets/sidebar/ui/nav-main';
import { useAppSelector } from '@/shared/hooks/use-store';

// ** Secondary Components **
import { AppLogo } from './app-logo';
import { NAVIGATIONS } from '@/widgets/sidebar/models/navigations';

// ** SVG Icons **
import { TechnocorpLogo } from '@/shared/components/SVGIcons';

// ** UI ui **
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
  const { user } = useAppSelector((state) => pick(state.auth, ['user']), shallowEqual);

  if (!user) return null;

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
          <SidebarGroupContent className="space-y-0.5">
            {NAVIGATIONS[user.role]?.map((item) => <NavMain key={item.title} item={item} />)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {sidebarOpen ? <Footer /> : null}
    </Sidebar>
  );
}
