import { describe, expect, it, vi } from 'vitest'
import { UserRoles } from '@/shared/types/user'
import { filterReportGroups } from './reports-catalog'

vi.mock('@/shared/hooks/use-current-role', () => ({ useCurrentRole: () => 'CHAIRMAN' }))
vi.mock('@/shared/hooks/use-auth', () => ({ useAuth: () => ({ user: null }) }))

const staffReports = (role: UserRoles, isSupervisor = false) =>
  filterReportGroups(role, isSupervisor)
    .find((group) => group.id === 'employees')
    ?.items.map((item) => item.url)

describe('the staff reports', () => {
  it('keep all of them for the chairman: the old turnstile report and the FaceID timesheet side by side', () => {
    expect(staffReports(UserRoles.CHAIRMAN)).toEqual([
      '/reports/top-100-organizations',
      '/reports/turniket-logs',
      '/attendance',
      '/reports/employee-device-login',
      '/reports/employees-dashboard',
    ])
  })

  it('give a regional head the attendance of their division only', () => {
    expect(staffReports(UserRoles.REGIONAL)).toEqual(['/attendance'])
  })

  it('stay closed to a supervisor and to the other roles', () => {
    expect(staffReports(UserRoles.REGIONAL, true)).toBeUndefined()
    expect(staffReports(UserRoles.HEAD)).toBeUndefined()
    expect(staffReports(UserRoles.INSPECTOR)).toBeUndefined()
  })
})
