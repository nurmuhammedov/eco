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
 *
 * `register/change/:id/:type` is not here. Its old and new shapes are two free
 * segments each, so no pattern can tell them apart; the page itself sorts the
 * two out, since only the section name has a known set of values.
 */
const MOVED: [from: string, to: string][] = [
  ['accreditations/detail/:id', '/accreditations/:id'],
  ['archive/:id/auto', '/archive/auto/:id'],
  ['archive/:id/equipments', '/archive/equipments/:id'],
  ['archive/:id/hf', '/archive/hf/:id'],
  ['archive/:id/irs', '/archive/irs/:id'],
  ['archive/:id/xrays', '/archive/xrays/:id'],
  ['register/:id/auto', '/register/auto/:id'],
  ['register/:id/equipments', '/register/equipments/:id'],
  ['register/:id/equipments/appeals', '/register/equipments/:id/appeals'],
  ['register/:id/hf', '/register/hf/:id'],
  ['register/:id/irs', '/register/irs/:id'],
  ['register/:id/xrays', '/register/xrays/:id'],
  ['risk-analysis/info/:id', '/risk-analysis/objects/:id'],
  ['staffs', '/employees'],
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
