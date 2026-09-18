import { Navigate, useLocation, useParams } from 'react-router-dom'
import { UserRoles } from '@/shared/types/user'
import { AppRouteDefinition } from './registry'

const LegacyRedirect = ({ to }: { to: string }) => {
  const params = useParams()
  const { search, hash } = useLocation()
  const target = to.replace(/:([A-Za-z0-9_]+)/g, (_, name: string) => params[name] ?? '')

  return <Navigate to={`${target}${search}${hash}`} replace />
}

/**
 * The addresses the pages used to answer on. A reader's bookmark, a link in an
 * old notification and anything printed on paper all outlive a rename, so the
 * old shape keeps working instead of landing on "page not found".
 *
 * These carry no direction and every cabinet: whoever follows one arrives at
 * the real route, which does the checking. Nothing new is reachable.
 */
const MOVED: [from: string, to: string][] = [
  ['accreditations/detail/:id', '/accreditations/:id'],
  ['accreditations/old/detail/:id', '/accreditations/old/:id'],
  ['accreditations/edit/:id', '/accreditations/:id/edit'],
  ['applications/detail/:id', '/applications/:id'],
  ['applications/create', '/applications/add'],
  ['applications/create/:type', '/applications/add/:type'],
  ['applications/inspector/create', '/applications/inspector/add'],
  ['cadastre-passport', '/cadastre-passports'],
  ['cadastre-passport/add', '/cadastre-passports/add'],
  ['cadastre-passport/:id', '/cadastre-passports/:id'],
  ['declarations/detail/:id', '/declarations/:id'],
  ['declarations/edit/:id', '/declarations/:id/edit'],
  ['department', '/departments'],
  ['inquiries/detail/:id', '/inquiries/:id'],
  ['news/create', '/news/add'],
  ['news/edit/:id', '/news/:id/edit'],
  ['preventions/detail/:id', '/preventions/:id'],
]

export const LEGACY_ROUTES: AppRouteDefinition[] = MOVED.map(([from, to]) => ({
  path: from,
  element: <LegacyRedirect to={to} />,
  roles: Object.values(UserRoles),
}))
