import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { InspectionDetail } from '@/entities/inspection/model/inspection.types'
import type { RegistryChange } from '@/entities/registry'
import { CloseRequestHeader, ClosedInspectionInfo } from './close-request-panel'

const hooks = vi.hoisted(() => ({
  role: 'REGIONAL',
  usePaginatedData: vi.fn(() => ({ data: { content: [] }, isLoading: false })),
}))

vi.mock('@/shared/hooks/use-auth', () => ({ useAuth: () => ({ user: { role: hooks.role } }) }))
vi.mock('@/shared/hooks', () => ({
  usePaginatedData: hooks.usePaginatedData,
  useAdd: () => ({ mutate: vi.fn(), isPending: false }),
}))

const request = (status: string): RegistryChange => ({
  id: 'c1',
  belongId: 'i-1',
  belongType: 'CLOSE_INSPECTION',
  status: status as RegistryChange['status'],
  ownerIdentity: 204464640,
  description: null,
  executorId: 'u-1',
  executorName: 'Karimov Anvar',
  regionId: 5,
  createdAt: '2026-11-18T10:15:00',
})

const renderWith = (node: ReactNode) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{node}</MemoryRouter>
    </QueryClientProvider>
  )

const requestLink = () => screen.queryByRole('link', { name: 'So‘rovni ko‘rish' })

beforeEach(() => {
  hooks.role = 'REGIONAL'
  hooks.usePaginatedData.mockClear()
})

describe('CloseRequestHeader', () => {
  it('tells the region its request waits on the committee and leads to the request’s page', () => {
    renderWith(<CloseRequestHeader inspectionId="i-1" closeRequest={request('IN_APPROVAL')} />)

    expect(screen.getByText('Yakunlash so‘rovi tasdiqlashda')).toBeInTheDocument()
    expect(requestLink()).toHaveAttribute('href', '/register/change/inspections/i-1')
    expect(screen.queryByRole('button', { name: /Qayta yuborish/ })).not.toBeInTheDocument()
  })

  it('lets the region send a returned request again, starting from its last sending', () => {
    renderWith(<CloseRequestHeader inspectionId="i-1" closeRequest={request('IN_PROCESS')} />)

    expect(screen.getByText('Yakunlash so‘rovi qaytarilgan')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Qayta yuborish/ })).toBeInTheDocument()
    expect(hooks.usePaginatedData).toHaveBeenCalledWith('/change-logs/by-change/c1', { page: 1, size: 100 }, true)
  })

  it('sends the MANAGER to the request’s page to decide on it', () => {
    hooks.role = 'MANAGER'
    renderWith(<CloseRequestHeader inspectionId="i-1" closeRequest={request('IN_APPROVAL')} />)

    expect(requestLink()).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tasdiqlash' })).not.toBeInTheDocument()
  })

  it('shows the others only where the request stands', () => {
    hooks.role = 'INSPECTOR'
    renderWith(<CloseRequestHeader inspectionId="i-1" closeRequest={request('IN_APPROVAL')} />)

    expect(screen.getByText('Yakunlash so‘rovi tasdiqlashda')).toBeInTheDocument()
    expect(requestLink()).not.toBeInTheDocument()
  })

  it('keeps the way to a confirmed request, and shows nothing without one', () => {
    const { unmount } = renderWith(<CloseRequestHeader inspectionId="i-1" closeRequest={request('COMPLETED')} />)
    expect(requestLink()).toBeInTheDocument()
    expect(screen.queryByText(/tasdiqlashda|qaytarilgan/)).not.toBeInTheDocument()
    unmount()

    const { container } = renderWith(<CloseRequestHeader inspectionId="i-1" closeRequest={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('ClosedInspectionInfo', () => {
  it('shows what a closed inspection was closed on, from the inspection itself', () => {
    renderWith(
      <ClosedInspectionInfo
        inspection={
          {
            id: 'i-1',
            status: 'CLOSED',
            closeBasisPath: 'inspections/files/yopish.pdf',
            closeComment: 'Faoliyat to‘xtatilgan',
            closedDate: '2026-11-20',
          } as InspectionDetail
        }
      />
    )

    expect(screen.getByText('20.11.2026')).toBeInTheDocument()
    expect(screen.getByText('yopish.pdf')).toBeInTheDocument()
    expect(screen.getByText('Faoliyat to‘xtatilgan')).toBeInTheDocument()
  })
})
