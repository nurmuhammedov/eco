import { describe, expect, it } from 'vitest'
import { canOpenModule, isModuleInMenu } from './module-access'
import { Direction, UserRoles } from '@/shared/types/user'

const viewer = (role: UserRoles, directions: Direction[] = []) => ({ role, directions })

const ALL_MODULE_IDS = [...Object.values(Direction), 'ORGANIZATIONS', 'TURNIKET_LOGS']

describe('canOpenModule', () => {
  it('opens a module the user holds the direction for', () => {
    expect(canOpenModule(Direction.REGISTRY, viewer(UserRoles.LEGAL, [Direction.REGISTRY]))).toBe(true)
    expect(canOpenModule(Direction.REGISTRY, viewer(UserRoles.LEGAL, [Direction.APPEAL]))).toBe(false)
  })

  it('lets a page without a module of its own through', () => {
    expect(canOpenModule(undefined, viewer(UserRoles.LEGAL))).toBe(true)
  })

  it('does not ask the administrator or HR for directions', () => {
    expect(canOpenModule(Direction.REGISTRY, viewer(UserRoles.ADMIN))).toBe(true)
    expect(canOpenModule(Direction.REGISTRY, viewer(UserRoles.HR))).toBe(true)
  })

  it('guards organisations by role, since the backend does the same', () => {
    expect(canOpenModule('ORGANIZATIONS', viewer(UserRoles.HEAD))).toBe(true)
    expect(canOpenModule('ORGANIZATIONS', viewer(UserRoles.CHAIRMAN))).toBe(true)
    expect(canOpenModule('ORGANIZATIONS', viewer(UserRoles.PROCURATOR, Object.values(Direction)))).toBe(false)
  })

  it('keeps pages that other pages link to reachable without the direction', () => {
    expect(canOpenModule(Direction.REPORT, viewer(UserRoles.INSPECTOR))).toBe(true)
    expect(canOpenModule(Direction.INQUIRY, viewer(UserRoles.INSPECTOR))).toBe(true)
  })

  it('still gives an account with no directions somewhere to start', () => {
    const applicant = viewer(UserRoles.INDIVIDUAL)

    expect(canOpenModule(Direction.APPEAL, applicant)).toBe(true)
    expect(canOpenModule(Direction.INSPECTION, applicant)).toBe(false)
  })
})

describe('isModuleInMenu', () => {
  it('shows what the directions allow', () => {
    expect(isModuleInMenu(Direction.REGISTRY, viewer(UserRoles.LEGAL, [Direction.REGISTRY]))).toBe(true)
    expect(isModuleInMenu(Direction.REGISTRY, viewer(UserRoles.LEGAL))).toBe(false)
  })

  it('leaves reports out of the menu until the direction is given', () => {
    expect(isModuleInMenu(Direction.REPORT, viewer(UserRoles.INSPECTOR, [Direction.INSPECTION]))).toBe(false)
    expect(isModuleInMenu(Direction.REPORT, viewer(UserRoles.INSPECTOR, [Direction.REPORT]))).toBe(true)
  })

  it('gives applicants their enquiries without a direction', () => {
    expect(isModuleInMenu(Direction.INQUIRY, viewer(UserRoles.INDIVIDUAL))).toBe(true)
    expect(isModuleInMenu(Direction.INQUIRY, viewer(UserRoles.ACCOUNTANT))).toBe(true)
    expect(isModuleInMenu(Direction.INQUIRY, viewer(UserRoles.INSPECTOR, [Direction.INSPECTION]))).toBe(false)
  })

  it('never offers a menu entry the router would refuse', () => {
    const viewers = Object.values(UserRoles).flatMap((role) => [
      viewer(role),
      viewer(role, [Direction.APPEAL]),
      viewer(role, Object.values(Direction)),
    ])

    for (const user of viewers) {
      for (const id of ALL_MODULE_IDS) {
        if (isModuleInMenu(id, user)) expect(canOpenModule(id, user), `${user.role} / ${id}`).toBe(true)
      }
    }
  })
})
