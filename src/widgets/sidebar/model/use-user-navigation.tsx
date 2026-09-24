import { useMemo } from 'react'
import { LucideHome } from 'lucide-react'
import { UserRoles } from '@/shared/types/user'
import { isModuleInMenu } from '@/shared/lib/access/module-access'
import { useAuth } from '@/shared/hooks/use-auth'
import { usePaginatedData } from '@/shared/hooks'
import { useKpiAccess } from '@/entities/kpi'
import { NAVIGATIONS } from './navigations'
import { Navigation } from './types'
import allNavigation from './all'
import legalNavigation from './legal'

const DASHBOARD_ROLES = [UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.CHAIRMAN]

/** What the two designated approvers see under KPI instead of their own scorecard. */
export const KPI_APPROVER_ITEMS = [
  { id: 'KPI', title: 'Boshqarma va bo‘limlar', url: '/kpi/departments' },
  { id: 'KPI', title: 'KPI vazifalar', url: '/kpi/tasks' },
]

/**
 * Builds the menu a user is allowed to see. Both the sidebar and the start-page
 * redirect read from here so they can never disagree.
 *
 * Which modules a user may reach is decided by `isModuleInMenu`, the same rule
 * the router consults - the two used to be written out separately and drifted,
 * leaving entries that led straight to "page not found".
 */
export const useUserNavigation = (): Navigation => {
  const { user } = useAuth()
  const isIndividual = user?.role === UserRoles.INDIVIDUAL

  const { totalElements: equipmentCount = 0 } = usePaginatedData(
    '/equipments',
    { page: 1, size: 1, active: true },
    isIndividual
  )

  // Approving is given to two named people, not to a role, so the menu has to
  // ask the server which of the heads they are.
  const { access } = useKpiAccess()

  return useMemo<Navigation>(() => {
    if (!user) return []

    const { role } = user

    // An individual's register is empty until something is registered in it,
    // and an empty section reads as a broken one.
    const isVisible = ({ id }: { id?: string }) =>
      isIndividual && id === 'REGISTRY' ? equipmentCount > 0 : isModuleInMenu(id, user)

    const base: Navigation = role === UserRoles.LEGAL ? legalNavigation : NAVIGATIONS[role] || allNavigation

    let navigations = base.reduce<Navigation>((acc, navItem) => {
      if (navItem.items?.length) {
        const items = navItem.items.filter(isVisible)

        if (items.length) acc.push({ ...navItem, items })

        return acc
      }

      if (isVisible(navItem)) acc.push(navItem)

      return acc
    }, [])

    // An approver signs off on other departments and files no scorecard of
    // their own, so their KPI section is a different pair of pages.
    if (access.is_approver) {
      navigations = navigations.map((item) => (item.id === 'KPI' ? { ...item, items: KPI_APPROVER_ITEMS } : item))
    }

    if (DASHBOARD_ROLES.includes(role)) {
      navigations = [{ title: 'Bosh sahifa', url: '/dashboard', icon: <LucideHome /> }, ...navigations]
    }

    return navigations
  }, [user, isIndividual, equipmentCount, access.is_approver])
}

/** First reachable page for the user, used as the landing route after sign-in. */
export const useStartPath = (): string | null => {
  const navigations = useUserNavigation()

  return useMemo(() => {
    for (const item of navigations) {
      if (item.items?.length) return item.items[0].url
      if (item.url) return item.url
    }

    return null
  }, [navigations])
}
