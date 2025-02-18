// ** Utils **
import { pick } from '@/shared/utils';

// ** Hooks **
import { useAppSelector } from '@/shared/hooks/useStore';

// ** Navigation **
import { NAVIGATIONS } from '@/widgets/sidebar';
import Icon from '@/shared/components/common/icon';

// ** Third party **
import { shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

// ** UI ui **
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';

export function MenuItems() {
  const { t } = useTranslation(['common']);
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
            tooltip={t(item.title)}
            isActive={pathname === item.url}
          >
            <Link to={item.url} className="flex items-center gap-x-2.5">
              <Icon name={item.icon} className="size-6" />
              <span>{t(item.title)}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
