import { Direction, UserRoles, UserState } from '@/shared/types/user'

type Viewer = Pick<UserState, 'role' | 'directions'>

/** These cabinets are fixed by role; a direction never enters into them. */
const ROLES_WITHOUT_DIRECTIONS: UserRoles[] = [UserRoles.ADMIN, UserRoles.HR]

/** Guarded by role on the backend rather than by a direction of its own. */
const ROLE_ONLY_MODULES: Record<string, UserRoles[]> = {
  ORGANIZATIONS: [UserRoles.HEAD, UserRoles.REGIONAL, UserRoles.CHAIRMAN],
}

/** Applicants raise and follow their own enquiries without being given the direction. */
const INQUIRY_MODULE: string = Direction.INQUIRY
const INQUIRY_ROLES: UserRoles[] = [UserRoles.INDIVIDUAL, UserRoles.ACCOUNTANT]

/**
 * Enquiries and reports are linked to from other pages - a report drills down
 * into a register, an inspection cites the enquiry behind it - so the address
 * stays reachable even where the module earns no menu entry of its own.
 */
const LINKED_TO_MODULES: string[] = [Direction.INQUIRY, Direction.REPORT]

/**
 * An account given no directions at all still files applications; without this
 * an applicant signs in to a cabinet with nothing in it.
 */
const FALLBACK_MODULE: string = Direction.APPEAL

const hasDirection = (id: string, { directions }: Viewer) => directions.includes(id as Direction)

/**
 * May the user open the page? The menu is built from `isModuleInMenu`, which is
 * a subset of this - so a menu entry can never lead somewhere the router
 * refuses, which is how the two rules used to drift apart.
 */
export const canOpenModule = (id: string | undefined, user: Viewer): boolean => {
  if (!id) return true
  if (ROLES_WITHOUT_DIRECTIONS.includes(user.role)) return true

  const allowedRoles = ROLE_ONLY_MODULES[id]
  if (allowedRoles) return allowedRoles.includes(user.role)

  if (LINKED_TO_MODULES.includes(id)) return true
  if (!user.directions.length) return id === FALLBACK_MODULE

  return hasDirection(id, user)
}

/** Does the module also earn a place in the menu? */
export const isModuleInMenu = (id: string | undefined, user: Viewer): boolean => {
  if (!canOpenModule(id, user)) return false
  if (!id || ROLES_WITHOUT_DIRECTIONS.includes(user.role)) return true
  if (ROLE_ONLY_MODULES[id]) return true

  if (id === INQUIRY_MODULE && INQUIRY_ROLES.includes(user.role)) return true
  if (!user.directions.length) return id === FALLBACK_MODULE

  return hasDirection(id, user)
}
