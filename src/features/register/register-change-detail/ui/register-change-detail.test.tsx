import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import RegisterChangeDetail from './register-change-detail'

const mocks = vi.hoisted(() => ({
  role: 'MANAGER',
  regionId: 5,
  change: {} as Record<string, unknown>,
  posted: [] as string[],
}))

const fakeAdd = vi.hoisted(() => (endpoint: string) => ({
  isPending: false,
  mutate: (_body: unknown, options?: { onSuccess?: () => void }) => {
    mocks.posted.push(endpoint)
    options?.onSuccess?.()
  },
  mutateAsync: () => {
    mocks.posted.push(endpoint)
    return Promise.resolve()
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: '3rdParty', init: () => undefined },
}))
vi.mock('@/shared/hooks/use-auth', () => ({
  useAuth: () => ({ user: { role: mocks.role, regionId: mocks.regionId } }),
}))
vi.mock('@/shared/hooks', () => ({
  useDetail: () => ({ detail: mocks.change, isLoading: false }),
  usePaginatedData: () => ({ data: { content: [] }, isLoading: false }),
  useAdd: fakeAdd,
}))
vi.mock('@/shared/hooks/api', () => ({ useAdd: fakeAdd }))
vi.mock('@/shared/api/dictionaries', () => ({
  useLegalOrganizationQuery: (tin?: unknown) => ({
    data: tin ? { identity: tin, name: '"ARMASAN KVAS" MCHJ' } : undefined,
  }),
}))
vi.mock('@/features/application/application-detail/ui/parts/legal-applicant-info', () => ({
  default: ({ tinNumber }: { tinNumber?: unknown }) => <span>Tashkilot {String(tinNumber)}</span>,
}))
vi.mock('@/features/application/application-detail/ui/modals/application-logs-modal', () => ({
  default: () => <span>Amaliyotlar tarixi</span>,
}))
vi.mock('./change-log-table', () => ({ default: ({ changeId }: { changeId?: string }) => <span>Log {changeId}</span> }))

const closeRequest = (status: string, description: string | null = null) => ({
  id: 'c1',
  belongId: 'i-1',
  belongType: 'CLOSE_INSPECTION',
  status,
  ownerIdentity: 204464640,
  description,
  executorId: 'u-1',
  executorName: 'QODIROV NODIRBEK TOIROVICH',
  regionId: 5,
  createdAt: '2026-11-18T21:34:45',
})

let queryClient: QueryClient

const renderPage = (path = '/register/change/inspections/i-1') =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/register/change/:type/:id" element={<RegisterChangeDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  mocks.role = 'MANAGER'
  mocks.regionId = 5
  mocks.posted = []
  mocks.change = closeRequest('IN_APPROVAL')
})

describe('RegisterChangeDetail for a request to close an inspection', () => {
  it('lays it out like the registry’s requests, leading to the inspection', () => {
    renderPage()

    expect(screen.getByText('Tekshiruvni o‘tkazmasdan yakunlash uchun so‘rov')).toBeInTheDocument()
    expect(screen.getByText('Tekshiruv ma’lumotlari:')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ko‘rish/ })).toHaveAttribute(
      'href',
      `/inspections/info?inspectionId=i-1&tin=204464640&name=${encodeURIComponent('"ARMASAN KVAS" MCHJ').replace(/%20/g, '+')}`
    )
    expect(screen.getByText('Tekshiruvni o‘tkazmasdan yakunlash')).toBeInTheDocument()
    expect(screen.getByText('QODIROV NODIRBEK TOIROVICH')).toBeInTheDocument()
    expect(screen.getByText('Tashkilot 204464640')).toBeInTheDocument()
    expect(screen.getByText('Log c1')).toBeInTheDocument()
  })

  it('lets the MANAGER confirm it, warning that the inspection closes, and refreshes the inspection', async () => {
    const user = userEvent.setup()
    queryClient.setQueryData(endpointKey('/inspections', 'i-1'), { status: 'ASSIGNED' })
    renderPage()

    expect(screen.getByRole('button', { name: 'Qaytarish' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tasdiqlash' }))
    expect(screen.getByText('Tekshiruv o‘tkazilmasdan yopiladi. Davom etasizmi?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ha' }))

    expect(mocks.posted).toEqual(['/changes/c1/confirm'])
    expect(queryClient.getQueryState(endpointKey('/inspections', 'i-1'))?.isInvalidated).toBe(true)
  })

  it('shows the region its request waiting on the committee', () => {
    mocks.role = 'REGIONAL'
    renderPage()

    expect(screen.getByText('Tasdiqlashda')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tasdiqlash' })).not.toBeInTheDocument()
  })

  it('lets the region send a returned request again, with the committee’s reason in view', () => {
    mocks.role = 'REGIONAL'
    mocks.change = closeRequest('IN_PROCESS', 'Asos fayl noto‘g‘ri')
    renderPage()

    expect(screen.getByRole('button', { name: /Qayta yuborish/ })).toBeInTheDocument()
    expect(screen.getByText('Qo‘mita izohi (qaytarish sababi):')).toBeInTheDocument()
    expect(screen.getByText('Asos fayl noto‘g‘ri')).toBeInTheDocument()
  })

  it('leaves another region’s returned request alone', () => {
    mocks.role = 'REGIONAL'
    mocks.regionId = 7
    mocks.change = closeRequest('IN_PROCESS', 'Izoh')
    renderPage()

    expect(screen.queryByRole('button', { name: /Qayta yuborish/ })).not.toBeInTheDocument()
  })
})
