import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCloseRequest } from './use-close-request'

const get = vi.hoisted(() => vi.fn())

vi.mock('@/shared/api/api-client', () => ({ apiClient: { get } }))
vi.mock('@/shared/hooks/use-auth', () => ({ useAuth: () => ({ user: { role: 'REGIONAL' } }) }))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

let queryClient: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

const answer = (change: object) => get.mockResolvedValue({ success: true, status: 200, data: { data: change } })

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  get.mockReset()
})

describe('useCloseRequest', () => {
  it('reads an inspection that was never asked to be closed as having no request', async () => {
    get.mockRejectedValue({ status: 404, message: 'topilmadi' })

    const { result } = renderHook(() => useCloseRequest('i-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(get).toHaveBeenCalledWith('/changes/by-belong/i-1', undefined, undefined, undefined, {
      silentErrorStatuses: [404],
    })
    expect(result.current.closeRequest).toBeNull()
    expect(result.current.isActive).toBe(false)
  })

  it('tells a request awaiting the MANAGER from a returned one', async () => {
    answer({ id: 'c1', belongType: 'CLOSE_INSPECTION', status: 'IN_APPROVAL' })
    const { result } = renderHook(() => useCloseRequest('i-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.closeRequest?.id).toBe('c1')
    expect(result.current).toMatchObject({ isInApproval: true, isReturned: false, isActive: true })

    answer({ id: 'c2', belongType: 'CLOSE_INSPECTION', status: 'IN_PROCESS' })
    const returned = renderHook(() => useCloseRequest('i-2', true), { wrapper })

    await waitFor(() => expect(returned.result.current.isResolved).toBe(true))
    expect(returned.result.current).toMatchObject({ isInApproval: false, isReturned: true, isActive: true })
  })

  it('keeps a confirmed request but no longer counts it as open', async () => {
    answer({ id: 'c1', belongType: 'CLOSE_INSPECTION', status: 'COMPLETED' })
    const { result } = renderHook(() => useCloseRequest('i-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.closeRequest?.id).toBe('c1')
    expect(result.current.isActive).toBe(false)
  })

  it('ignores a latest change of any other kind', async () => {
    answer({ id: 'c9', belongType: 'UPDATE_HF', status: 'IN_APPROVAL' })
    const { result } = renderHook(() => useCloseRequest('i-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.closeRequest).toBeNull()
    expect(result.current.isActive).toBe(false)
  })

  it('asks nothing until it is enabled', () => {
    const { result } = renderHook(() => useCloseRequest('i-1', false), { wrapper })

    expect(get).not.toHaveBeenCalled()
    expect(result.current.isResolved).toBe(false)
  })
})
