// ** Utils **
import { Direction, UserRoles } from '@/entities/user';
import { apiConfig } from '@/shared/api/constants';

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
import { useAppSelector } from '@/shared/hooks/use-store';
import { cn } from '@/shared/lib/utils';
import { pick } from '@/shared/utils';
import { NAVIGATIONS } from '@/widgets/sidebar/models/navigations';
import { Navigation } from '@/widgets/sidebar/models/types';
import { NavMain } from '@/widgets/sidebar/ui/nav-main';
import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import allNavigation from '../models/all';

// ** Secondary Components **
import { AppLogo } from './app-logo';

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

  const displayedNavigations: Navigation = useMemo(() => {
    if (!user) return [];

    if (
      user.role === UserRoles.ADMIN ||
      (user.role === UserRoles.MANAGER && apiConfig.oneIdClientId == 'test_cirns_uz')
    ) {
      return NAVIGATIONS[user.role];
    }

    if (user.directions.length === 0) {
      const appealNav = allNavigation.find((item: any) => item.id === 'APPEAL');
      return appealNav ? [appealNav] : [];
    }

    return allNavigation.filter((navItem) => user.directions.includes(navItem.id as Direction));
  }, [user]);

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
            {displayedNavigations.map((item) => (
              <NavMain key={item.title} item={item} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {sidebarOpen ? <Footer /> : null}
    </Sidebar>
  );
}
