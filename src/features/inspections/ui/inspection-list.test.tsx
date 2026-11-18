import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { InspectionList } from './inspection-list'

const mocks = vi.hoisted(() => ({
  role: 'MANAGER',
  usePaginatedData: vi.fn(() => ({ data: undefined, isLoading: false, totalPages: 0 })),
}))

vi.mock('@/shared/hooks/api/use-paginated-data', () => ({ default: mocks.usePaginatedData }))
vi.mock('@/shared/hooks/use-auth', () => ({ useAuth: () => ({ user: { role: mocks.role } }) }))
vi.mock('@/shared/api/dictionaries', () => ({ useDistrictSelectQuery: () => ({ data: [] }) }))
vi.mock('@/shared/components/common/data-table', () => ({ DataTable: () => null }))

/** The params the list asked `/inspections` for */
const requested = (search: string) => {
  render(
    <MemoryRouter initialEntries={[`/inspections/risk-based?${search}`]}>
      <InspectionList />
    </MemoryRouter>
  )

  const [endpoint, params] = mocks.usePaginatedData.mock.calls.at(-1) as unknown as [string, Record<string, unknown>]
  expect(endpoint).toBe('/inspections')

  return params
}

beforeEach(() => {
  mocks.role = 'MANAGER'
  mocks.usePaginatedData.mockClear()
})

describe('InspectionList filters', () => {
  it('asks the requests tab by the request’s status, whatever the inspection’s own', () => {
    const params = requested('status=CLOSE_REQUESTS&year=2026&month=11')

    expect(params.closeRequestStatus).toBe('IN_APPROVAL')
    expect(params.status).toBeUndefined()
  })

  it('asks the returned sub-tab for the requests turned back, for the region as for the MANAGER', () => {
    for (const role of ['REGIONAL', 'MANAGER']) {
      mocks.role = role
      const params = requested('status=CLOSE_REQUESTS&closeStatus=IN_PROCESS')

      expect(params.closeRequestStatus).toBe('IN_PROCESS')
      expect(params.status).toBeUndefined()
      // The sub-tab is the frontend's own: the backend is asked by closeRequestStatus alone
      expect(params).not.toHaveProperty('closeStatus')
    }
  })

  it('does not filter the other tabs by a sub-tab left in the address', () => {
    expect(requested('status=ALL&closeStatus=IN_PROCESS')).toMatchObject({ closeRequestStatus: undefined })
    expect(requested('status=ASSIGNED&subStatus=ASSIGNED&closeStatus=IN_PROCESS')).toMatchObject({
      status: 'ASSIGNED',
      closeRequestStatus: undefined,
    })
  })

  it('asks the closed tab by the inspection’s status', () => {
    const params = requested('status=CLOSED')

    expect(params.status).toBe('CLOSED')
    expect(params.closeRequestStatus).toBeUndefined()
  })

  it('keeps the existing tabs as they were', () => {
    expect(requested('status=ALL')).toMatchObject({ status: undefined, closeRequestStatus: undefined })
    expect(requested('status=ASSIGNED&subStatus=CONDUCTED')).toMatchObject({ status: 'CONDUCTED' })
    expect(requested('status=NOT_SIGNED')).toMatchObject({ status: 'NOT_SIGNED' })
  })

  it('gives an inspector the closed sub-tab, and never the request filter', () => {
    mocks.role = 'INSPECTOR'

    expect(requested('subStatus=CLOSED')).toMatchObject({ status: 'CLOSED', closeRequestStatus: undefined })
    expect(requested('status=CLOSE_REQUESTS&subStatus=ASSIGNED')).toMatchObject({
      status: 'ASSIGNED',
      closeRequestStatus: undefined,
    })
  })
})
