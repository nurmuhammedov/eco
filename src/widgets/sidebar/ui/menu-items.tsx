// ** Types **
import { NavigationItem } from 'src/widgets/sidebar/models';
// ** Common components **
import Icon from '@/shared/components/common/icon';

// ** Third party **
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

// ** UI ui **
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';

interface Props {
  item: NavigationItem;
}

export function MenuItems({ item }: Props) {
  const { pathname } = useLocation();
  const { t } = useTranslation(['common']);

  const renderSingleMenus = () => {
    return (
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
    );
  };

  return <SidebarMenu>{renderSingleMenus()}</SidebarMenu>;
}
