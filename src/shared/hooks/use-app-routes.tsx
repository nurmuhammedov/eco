import { lazy, useEffect, useMemo, useState } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import {
  accountantRoutes,
  adminRoutes,
  chairmanRoutes,
  headRoutes,
  hrRoutes,
  individualRoutes,
  inspectorRoutes,
  interactiveServiceRoutes,
  legalRoutes,
  managerRoutes,
  regionalRoutes,
} from '@/shared/config/routes/roles'
import { authRoutes, publicRoutes, specialComponents } from '@/shared/config/routes'
import { withFullPageSuspense } from '@/shared/config/routes/utils'
import {
  GUEST_LANDING_PATH,
  IS_STATIC_LANDING,
  escapeStrandedLanding,
  goToGuestLanding,
  isAtGuestLanding,
} from '@/shared/config/navigation'
import { useAuth } from '@/shared/hooks/use-auth'
import { Direction, UserRoles } from '@/entities/user'
import { BootScreen } from '@/shared/components/common'
import StartRedirect from '@/shared/layouts/ui/start-redirect'
import { PWAInstallPrompt } from '@/shared/components/common/pwa-install-prompt/pwa-install-prompt'

const AppLayout = lazy(() => import('@/shared/layouts/ui/app-layout'))
const AuthLayout = lazy(() => import('@/shared/layouts/ui/auth-layout'))

const ROUTES_BY_ROLE: Record<UserRoles, RouteObject[]> = {
  [UserRoles.ADMIN]: adminRoutes,
  [UserRoles.LEGAL]: legalRoutes,
  [UserRoles.REGIONAL]: regionalRoutes,
  [UserRoles.INSPECTOR]: inspectorRoutes,
  [UserRoles.CHAIRMAN]: chairmanRoutes,
  [UserRoles.MANAGER]: managerRoutes,
  [UserRoles.HEAD]: headRoutes,
  [UserRoles.INDIVIDUAL]: individualRoutes,
  [UserRoles.ACCOUNTANT]: accountantRoutes,
  [UserRoles.PROCURATOR]: chairmanRoutes,
  [UserRoles.INTERACTIVE_SERVICE]: interactiveServiceRoutes,
  [UserRoles.HR]: hrRoutes,
}

/** Directions gate which modules a user can reach; these two are available to everyone. */
const ALWAYS_ALLOWED_ROUTE_IDS = new Set(['INQUIRY', 'REPORT'])

const GuestRedirect = () => {
  const stranded = IS_STATIC_LANDING && isAtGuestLanding()
  const [isEscaping, setIsEscaping] = useState(false)

  useEffect(() => {
    if (!IS_STATIC_LANDING) return

    // Running inside the app on the landing path means a cached shell answered
    // instead of the server; reloading without it lands on the real landing page.
    if (stranded) setIsEscaping(escapeStrandedLanding())
    else goToGuestLanding()
  }, [stranded])

  if (!IS_STATIC_LANDING) return <Navigate to={GUEST_LANDING_PATH} replace />

  // Only reached when the escape above has already been tried in this tab.
  if (stranded && !isEscaping) return <Navigate to="/auth/login" replace />

  return <BootScreen />
}

const toRouteObject = ({ path, element }: RouteObject): RouteObject => ({ path, element })

export const useAppRoutes = () => {
  const { user, isLoading } = useAuth()

  const routeConfig = useMemo<RouteObject[]>(() => {
    if (!user) {
      return [
        {
          path: 'auth',
          element: withFullPageSuspense(AuthLayout),
          children: [{ index: true, element: <GuestRedirect /> }, ...authRoutes.map(toRouteObject)],
        },
        ...publicRoutes.map(toRouteObject),
        { path: '*', element: <GuestRedirect /> },
      ]
    }

    const allRoleRoutes = ROUTES_BY_ROLE[user.role] ?? []
    const roleRoutes = allRoleRoutes.filter(({ id }) => {
      if (!id || user.role === UserRoles.ADMIN) return true
      return ALWAYS_ALLOWED_ROUTE_IDS.has(id) || user.directions.includes(id as Direction)
    })

    // The interactive service role has no sidebar or header, so its pages render outside the app layout.
    const isStandalone = user.role === UserRoles.INTERACTIVE_SERVICE

    return [
      {
        path: '/',
        element: withFullPageSuspense(AppLayout),
        children: [{ index: true, element: <StartRedirect /> }, ...(isStandalone ? [] : roleRoutes.map(toRouteObject))],
      },
      ...(isStandalone ? roleRoutes.map(toRouteObject) : []),
      ...publicRoutes.map(toRouteObject),
      { path: 'auth/*', element: <Navigate to="/" replace /> },
      { path: '*', element: withFullPageSuspense(specialComponents.notFound) },
    ]
  }, [user])

  const element = useRoutes(routeConfig)

  if (isLoading && !user) return <BootScreen />

  return (
    <>
      {element}
      <PWAInstallPrompt />
    </>
  )
}
