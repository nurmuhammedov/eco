import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { InspectionWidget } from './inspection-widget'

type Params = Record<string, unknown>

const mocks = vi.hoisted(() => ({
  role: 'MANAGER',
  useData: vi.fn((endpoint: string) => ({
    data: endpoint === '/inspections/count' ? { allCount: 12, closedCount: 4 } : undefined,
  })),
  usePaginatedData: vi.fn((_endpoint: string, params: Record<string, unknown>, _enabled?: boolean) => ({
    totalElements: params.closeRequestStatus === 'IN_APPROVAL' ? 3 : params.closeRequestStatus === 'IN_PROCESS' ? 2 : 0,
  })),
}))

vi.mock('@/shared/hooks', () => ({ useData: mocks.useData, usePaginatedData: mocks.usePaginatedData }))
vi.mock('@/shared/hooks/use-auth', () => ({ useAuth: () => ({ user: { role: mocks.role } }) }))
vi.mock('@/features/inspections/ui/inspection-list', () => ({ InspectionList: () => null }))
vi.mock('@/features/inspections/ui/other-inspection-list', () => ({ OtherInspectionList: () => null }))
vi.mock('@/features/inspections/ten-days-decree/ui/ten-days-decree-list', () => ({ TenDaysDecreeList: () => null }))
vi.mock('@/features/inspections/ui/parts/create-other-inspection-modal', () => ({
  CreateOtherInspectionModal: () => null,
}))
vi.mock('@/widgets/prevention/ui/prevention-widget', () => ({ getRegionLabel: (name: string) => name }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

const Address = () => <output data-testid="address">{useLocation().search}</output>

const renderWidget = (search = '') =>
  render(
    <MemoryRouter initialEntries={[`/inspections/risk-based${search}`]}>
      <InspectionWidget type="RISK_BASED" />
      <Address />
    </MemoryRouter>
  )

/** Whether the count of a close-request status was asked for, and whether it was enabled */
const countCall = (closeRequestStatus: string) =>
  mocks.usePaginatedData.mock.calls.find(([, params]) => (params as Params).closeRequestStatus === closeRequestStatus)

beforeEach(() => {
  mocks.role = 'MANAGER'
  mocks.usePaginatedData.mockClear()
})

describe('InspectionWidget close tabs', () => {
  it.each(['MANAGER', 'REGIONAL'])('gives the %s every open request to close, counted together', (role) => {
    mocks.role = role
    renderWidget()

    expect(screen.getByRole('tab', { name: /O‘tkazilmasdan yakunlanganlar\s*4/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Yakunlash so‘rovlari\s*5/ })).toBeInTheDocument()
    expect(countCall('IN_APPROVAL')?.[2]).toBe(true)
    expect(countCall('IN_PROCESS')?.[2]).toBe(true)
  })

  it('splits the open requests by their status, each with its count', async () => {
    const user = userEvent.setup()
    renderWidget('?status=CLOSE_REQUESTS')

    expect(screen.getByRole('tab', { name: /Tasdiqlashda\s*3/ })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: /Qaytarilgan\s*2/ }))

    expect(screen.getByTestId('address').textContent).toContain('closeStatus=IN_PROCESS')
    expect(screen.getByRole('tab', { name: /Qaytarilgan\s*2/ })).toHaveAttribute('aria-selected', 'true')
  })

  it('shows the others only the closed inspections', () => {
    mocks.role = 'HEAD'
    renderWidget()

    expect(screen.getByRole('tab', { name: /O‘tkazilmasdan yakunlanganlar/ })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: /Yakunlash so‘rovlari/ })).not.toBeInTheDocument()
    expect(countCall('IN_APPROVAL')?.[2]).toBe(false)
  })

  it('adds the closed sub-tab for an inspector', () => {
    mocks.role = 'INSPECTOR'
    renderWidget()

    expect(screen.getByRole('tab', { name: /O‘tkazilmasdan yakunlangan\s*4/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Tekshiruv o‘tkazilmagan/ })).toBeInTheDocument()
  })
})
