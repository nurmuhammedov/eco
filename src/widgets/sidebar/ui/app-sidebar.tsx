import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Book } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar'
import { useNavigationProgress } from '@/shared/components/common'

import { useUserNavigation } from '@/widgets/sidebar/model/use-user-navigation'
import type { NavigationItem } from '@/widgets/sidebar/model/types'
import { NavMain } from '@/widgets/sidebar/ui/nav-main'
import { useAuth } from '@/shared/hooks/use-auth'
import { AppLogo } from './app-logo'

const REPORTS_URL = '/reports'

const basePath = (url: string) => url.split('?')[0]

const isUnder = (pathname: string, url: string) => pathname === url || pathname.startsWith(`${url}/`)

/** The section the current page belongs to - opened on arrival */
const activeTitle = (navigations: NavigationItem[], pathname: string) =>
  navigations.find(
    (item) =>
      item.items?.length &&
      (isUnder(pathname, basePath(item.url)) ||
        item.items.some(
          (sub) => isUnder(pathname, basePath(sub.url)) || sub.activeUrls?.some((url) => isUnder(pathname, url))
        ))
  )?.title ?? null

/**
 * Inside the reports the sidebar turns into their own menu: the report sections
 * replace the main menu, with a way back to it at the top.
 */
const ReportsMenu = ({ item, onBack }: { item: NavigationItem; onBack: () => void }) => {
  const { pathname } = useLocation()
  const { t } = useTranslation(['common'])
  const { startNavigation } = useNavigationProgress()

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onBack} className="text-sidebar-foreground/80">
            <ArrowLeft />
            <span>Asosiy menyu</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroupLabel className="text-sidebar-foreground/70 border-sidebar-foreground/20 mt-2 mb-1 flex items-center gap-2 rounded-none border-t pt-3 text-xs font-semibold tracking-wide uppercase [&>svg]:size-4">
        {item.icon}
        {t(item.title)}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {(item.items ?? []).map((section) => {
            const isActive =
              isUnder(pathname, basePath(section.url)) || !!section.activeUrls?.some((url) => isUnder(pathname, url))

            return (
              <SidebarMenuItem key={section.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="h-auto min-h-8 py-1.5 [&>span:last-child]:overflow-visible [&>span:last-child]:whitespace-normal"
                >
                  <Link to={section.url} onClick={() => startNavigation(section.url)}>
                    <span>{t(section.title)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  const { user } = useAuth()
  const navigations = useUserNavigation()
  const { pathname } = useLocation()
  const { state, isMobile } = useSidebar()

  // Only one section unfolds at a time; arriving on a page opens its own
  const [openTitle, setOpenTitle] = useState<string | null>(() => activeTitle(navigations, pathname))
  useEffect(() => {
    const title = activeTitle(navigations, pathname)
    if (title) setOpenTitle(title)
  }, [navigations, pathname])

  const reports = useMemo(
    () => navigations.find((item) => item.id === 'REPORT' && item.url === REPORTS_URL && item.items?.length),
    [navigations]
  )

  // "Asosiy menyu" brings the main menu back without leaving the report; the
  // next visit to the reports opens their menu again
  const [showMain, setShowMain] = useState(false)
  const isInReports = !!reports && isUnder(pathname, REPORTS_URL)
  useEffect(() => {
    if (!isInReports) setShowMain(false)
  }, [isInReports])

  // Folded to icons there is no room for a second menu; the sections hang off the icon instead
  const isIconOnly = state === 'collapsed' && !isMobile
  const showReportsMenu = isInReports && !showMain && !isIconOnly

  if (!user) return null

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarGroup className="border-b p-0">
          <AppLogo />
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        {showReportsMenu && reports ? (
          <ReportsMenu item={reports} onBack={() => setShowMain(true)} />
        ) : (
          <SidebarGroup>
            <SidebarGroupContent className="space-y-1">
              {navigations.map((item) =>
                // Expanded, the reports entry is a door into their own menu rather than a fold-out list
                item === reports && !isIconOnly ? (
                  <NavMain
                    key={item.title}
                    item={{ ...item, items: undefined }}
                    // Coming back to the reports opens their menu even if it was left with "Asosiy menyu"
                    onOpenChange={() => setShowMain(false)}
                  />
                ) : (
                  <NavMain
                    key={item.title}
                    item={item}
                    open={item.items?.length ? openTitle === item.title : undefined}
                    onOpenChange={(open) => setOpenTitle(open ? item.title : null)}
                  />
                )
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Kutubxona">
              <a href="https://edu.ktnu.uz/library" target="_blank" rel="noopener noreferrer">
                <Book />
                <span>Kutubxona</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
