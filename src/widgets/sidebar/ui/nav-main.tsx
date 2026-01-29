import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { NavigationItem } from '@/widgets/sidebar/models/types'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import {
  SidebarMenu,
  // SidebarMenuAction, // Removed as per client structure
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar'

export function NavMain({ item }: { item: NavigationItem }) {
  const { pathname } = useLocation()
  const { t } = useTranslation(['common'])
  const isActive = pathname.startsWith(item.url)

  return (
    <SidebarMenu>
      <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            {item.items?.length ? (
              <SidebarMenuButton tooltip={t(item.title)}>
                {item.icon}
                <span>{t(item.title)}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton asChild isActive={isActive} tooltip={t(item.title)}>
                <Link to={item.url}>
                  {item.icon}
                  <span>{t(item.title)}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </CollapsibleTrigger>

          {item.items?.length ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                      <Link to={subItem.url}>
                        <span>{t(subItem.title)}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}
