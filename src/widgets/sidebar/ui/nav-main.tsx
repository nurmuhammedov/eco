import { Fragment } from 'react';
import { cn } from '@/shared/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Icon from '@/shared/components/common/icon';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from '@/widgets/sidebar/models/types';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';

export function NavMain({ item }: { item: NavigationItem }) {
  const { pathname } = useLocation();
  const { t } = useTranslation(['common']);
  const isActive = pathname.startsWith(item.url);
  return (
    <SidebarMenu>
      {
        <Collapsible key={item.title} asChild defaultOpen={isActive}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton asChild size="lg" isActive={isActive} tooltip={t(item.title)}>
                <Link to={item.url}>
                  {typeof item.icon === 'string' ? <Icon name={item.icon} /> : item.icon}
                  <span>{t(item.title)}</span>
                </Link>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            {item.items?.length ? (
              <Fragment>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight
                      className={cn({
                        'text-sidebar-accent-foreground': isActive,
                      })}
                    />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild size="lg" isActive={pathname === subItem.url}>
                          <Link to={subItem.url}>
                            <span>{t(subItem.title)}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Fragment>
            ) : null}
          </SidebarMenuItem>
        </Collapsible>
      }
    </SidebarMenu>
  );
}
