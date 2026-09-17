import { describe, expect, it } from 'vitest'
import { isRouteVisible, visibleRoutes } from './visible-routes'
import { Direction, UserRoles } from '@/shared/types/user'

const viewer = (role: UserRoles, directions: Direction[] = []) => ({ role, directions })

describe('isRouteVisible', () => {
  it('hides a page that does not belong to the cabinet, whatever the directions say', () => {
    const route = { roles: [UserRoles.INSPECTOR], id: Direction.REGISTRY }

    expect(isRouteVisible(route, viewer(UserRoles.LEGAL, [Direction.REGISTRY]))).toBe(false)
  })

  it('shows a page without a direction to anyone whose cabinet it is', () => {
    const route = { roles: [UserRoles.LEGAL], id: undefined }

    expect(isRouteVisible(route, viewer(UserRoles.LEGAL))).toBe(true)
  })

  it('needs the matching direction when the page declares one', () => {
    const route = { roles: [UserRoles.LEGAL], id: Direction.REGISTRY }

    expect(isRouteVisible(route, viewer(UserRoles.LEGAL, [Direction.REGISTRY]))).toBe(true)
    expect(isRouteVisible(route, viewer(UserRoles.LEGAL, [Direction.APPEAL]))).toBe(false)
    expect(isRouteVisible(route, viewer(UserRoles.LEGAL))).toBe(false)
  })

  it('lets the administrator past the direction gate', () => {
    const route = { roles: [UserRoles.ADMIN], id: Direction.REGISTRY }

    expect(isRouteVisible(route, viewer(UserRoles.ADMIN))).toBe(true)
  })

  it('keeps inquiries and reports open to everyone who has the cabinet', () => {
    expect(isRouteVisible({ roles: [UserRoles.LEGAL], id: Direction.INQUIRY }, viewer(UserRoles.LEGAL))).toBe(true)
    expect(isRouteVisible({ roles: [UserRoles.LEGAL], id: Direction.REPORT }, viewer(UserRoles.LEGAL))).toBe(true)
  })
})

describe('visibleRoutes', () => {
  it('gives a user with no directions only the pages that do not ask for one', () => {
    const routes = visibleRoutes(viewer(UserRoles.LEGAL))

    expect(routes.length).toBeGreaterThan(0)
    expect(routes.every(({ id }) => !id || ['INQUIRY', 'REPORT'].includes(id))).toBe(true)
  })

  it('never returns a page belonging to another cabinet', () => {
    const routes = visibleRoutes(viewer(UserRoles.INDIVIDUAL, Object.values(Direction)))

    expect(routes.every(({ roles }) => roles.includes(UserRoles.INDIVIDUAL))).toBe(true)
  })

  it('does not hand out the same path twice, which would make the first one win silently', () => {
    const paths = visibleRoutes(viewer(UserRoles.INSPECTOR, Object.values(Direction))).map(({ path }) => path)

    expect(new Set(paths).size).toBe(paths.length)
  })
})
