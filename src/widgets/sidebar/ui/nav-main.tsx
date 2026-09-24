import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { NavigationItem } from '@/widgets/sidebar/model/types'
import { useNavigationProgress } from '@/shared/components/common'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/shared/components/ui/sidebar'

const basePath = (url: string) => url.split('?')[0]

/**
 * The sidebar truncates a label to one line, which cut several of these in half
 * - "Xavf tahlili asosidagi tekshiruvlar" showed as "Xavfni tahlili asosida...".
 * Uzbek section names are long enough that shortening them would cost more than
 * the second line does, so they wrap instead.
 */
const WRAP = 'h-auto min-h-8 py-1.5 [&>span:last-child]:overflow-visible [&>span:last-child]:whitespace-normal'

export function NavMain({ item }: { item: NavigationItem }) {
  const { pathname } = useLocation()
  const { t } = useTranslation(['common'])
  const { startNavigation } = useNavigationProgress()
  const { state, isMobile } = useSidebar()

  const isActive = pathname.startsWith(basePath(item.url))
  const subItems = item.items ?? []
  const isIconOnly = state === 'collapsed' && !isMobile

  /**
   * Collapsed to icons there is no room to unfold the children, and the parent
   * button only toggles - so a section with children used to be unreachable
   * until the sidebar was opened again. The children move into a menu hanging
   * off the icon instead.
   */
  if (subItems.length && isIconOnly) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton isActive={isActive} tooltip={t(item.title)}>
                {item.icon}
                <span>{t(item.title)}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" sideOffset={8} className="min-w-56">
              <DropdownMenuLabel>{t(item.title)}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {subItems.map((subItem) => (
                <DropdownMenuItem key={subItem.title} asChild>
                  <Link to={subItem.url} onClick={() => startNavigation(subItem.url)}>
                    {t(subItem.title)}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            {subItems.length ? (
              <SidebarMenuButton isActive={isActive} tooltip={t(item.title)} className={isIconOnly ? undefined : WRAP}>
                {item.icon}
                <span>{t(item.title)}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={t(item.title)}
                className={isIconOnly ? undefined : WRAP}
              >
                <Link to={item.url} onClick={() => startNavigation(item.url)}>
                  {item.icon}
                  <span>{t(item.title)}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </CollapsibleTrigger>

          {subItems.length ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {subItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild isActive={pathname === basePath(subItem.url)} className={WRAP}>
                      <Link to={subItem.url} onClick={() => startNavigation(subItem.url)}>
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
