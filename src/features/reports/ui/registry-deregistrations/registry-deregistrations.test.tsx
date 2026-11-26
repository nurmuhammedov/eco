import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegistryDeregistrationsReport from './index'

const counts = (autoCancelledCount: number) => ({
  allCount: 20 + autoCancelledCount,
  newCount: 5,
  inProcessCount: 7,
  completedCount: 8,
  autoCancelledCount,
})

vi.mock('@/shared/hooks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/shared/hooks')>()),
  useData: () => ({
    data: [{ regionName: 'Toshkent shahri', regionId: 5, hf: counts(4), equipment: counts(0), irs: null, xray: null }],
    isLoading: false,
  }),
}))

describe('RegistryDeregistrationsReport', () => {
  it('counts the requests the system cancelled and opens them in the registry', () => {
    render(
      <MemoryRouter>
        <RegistryDeregistrationsReport />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Avtomatik bekor qilingan')).toHaveLength(4)

    const link = screen.getByRole('link', { name: '4' })
    const url = new URL(link.getAttribute('href') ?? '', 'http://x')
    expect(url.pathname).toBe('/register')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      tab: 'hf',
      active: 'CHANGED',
      reportChangeBelongType: 'HF',
      reportChangeStatus: 'AUTO_CANCELLED',
      regionId: '5',
    })
  })
})
