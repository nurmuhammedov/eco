// ** Utils **
import { pick } from '@/shared/utils';

// ** Store **
import { useAppSelector } from '@/store/hooks';

// ** Navigation **
import { NAVIGATIONS } from '@/layouts/navigation';

// ** Third party **
import { shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

// ** UI components **
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';

export function MenuItems() {
  const { pathname } = useLocation();
  const { user } = useAppSelector(
    (state) => pick(state.auth, ['user']),
    shallowEqual,
  );

  if (!user) return null;

  return (
    <SidebarMenu>
      {NAVIGATIONS[user.role].map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            size="lg"
            tooltip={item.title}
            isActive={pathname === item.url}
          >
            <Link to={item.url} className="flex items-center gap-x-2.5">
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
