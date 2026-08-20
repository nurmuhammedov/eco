import { useMemo } from 'react'
import { LucideHome } from 'lucide-react'
import { Direction, UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { usePaginatedData } from '@/shared/hooks'
import { NAVIGATIONS } from './navigations'
import { Navigation, NavigationItem } from './types'
import allNavigation from './all'
import legalNavigation from './legal'

const DASHBOARD_ROLES = [UserRoles.REGIONAL, UserRoles.INSPECTOR, UserRoles.CHAIRMAN]
const INQUIRY_ROLES = [UserRoles.INDIVIDUAL, UserRoles.ACCOUNTANT]
const HEAD_ONLY_ATTESTATION_IDS = ['ATTESTATION_DIRECTIONS', 'ATTESTATION_QUESTIONS']

/**
 * Builds the menu a user is allowed to see. Both the sidebar and the start-page
 * redirect read from here so they can never disagree.
 */
export const useUserNavigation = (): Navigation => {
  const { user } = useAuth()
  const isIndividual = user?.role === UserRoles.INDIVIDUAL

  const { totalElements: equipmentCount = 0 } = usePaginatedData(
    '/equipments',
    { page: 1, size: 1, active: true },
    isIndividual
  )

  return useMemo<Navigation>(() => {
    if (!user) return []

    const { role, directions } = user
    let navigations: Navigation = []

    if (role === UserRoles.ADMIN || role === UserRoles.HR) {
      navigations = NAVIGATIONS[role]
    } else if (role === UserRoles.LEGAL) {
      navigations = legalNavigation.filter((item) => directions.includes(item.id as Direction))
    } else if (directions.length === 0) {
      const pick = (id: string) => allNavigation.find((item: NavigationItem) => item.id === id)

      navigations = [
        pick('APPEAL'),
        INQUIRY_ROLES.includes(role) ? pick('INQUIRY') : undefined,
        isIndividual && equipmentCount > 0 ? pick('REGISTRY') : undefined,
      ].filter(Boolean) as Navigation
    } else {
      const baseNavigation: Navigation = NAVIGATIONS[role] || allNavigation

      navigations = baseNavigation.reduce<Navigation>((acc, navItem) => {
        if (navItem.items?.length) {
          const items = navItem.items.filter((subItem) => {
            if (role === UserRoles.HEAD && HEAD_ONLY_ATTESTATION_IDS.includes(subItem.id ?? '')) return true

            return subItem.id ? directions.includes(subItem.id as Direction) : false
          })

          if (items.length) acc.push({ ...navItem, items })

          return acc
        }

        const isSpecialInquiry = INQUIRY_ROLES.includes(role) && navItem.id === 'INQUIRY'
        let shouldShow = directions.includes(navItem.id as Direction) || isSpecialInquiry

        if (isIndividual && navItem.id === 'REGISTRY') {
          shouldShow = equipmentCount > 0
        }

        if (navItem.id === 'ORGANIZATIONS' && (role === UserRoles.HEAD || role === UserRoles.REGIONAL)) {
          shouldShow = true
        }

        if (shouldShow) acc.push(navItem)

        return acc
      }, [])
    }

    if (DASHBOARD_ROLES.includes(role)) {
      navigations = [{ title: 'Bosh sahifa', url: '/dashboard', icon: <LucideHome /> }, ...navigations]
    }

    return navigations
  }, [user, isIndividual, equipmentCount])
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
