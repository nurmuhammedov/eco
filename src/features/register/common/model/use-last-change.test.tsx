import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useLastChange } from './use-last-change'

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
  vi.mocked(toast.error).mockClear()
})

describe('useLastChange', () => {
  it('reads a record that never had a change as none, without a toast', async () => {
    get.mockRejectedValue({ status: 404, message: 'topilmadi' })

    const { result } = renderHook(() => useLastChange('hf-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.lastChange).toBeNull()
    expect(result.current.hasOpenChange).toBe(false)
    expect(get).toHaveBeenCalledWith('/changes/by-belong/hf-1', undefined, undefined, undefined, {
      silentErrorStatuses: [404],
    })
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('fails on any other error, leaving its toast to the interceptor', async () => {
    // A network failure reaches the hook as 500 with no answer behind it: the interceptor shows nothing for that
    get.mockRejectedValue({ status: 500, message: 'Network Error' })

    const { result } = renderHook(() => useLastChange('hf-1', true), { wrapper })

    await waitFor(() => expect(queryClient.getQueryCache().getAll()[0]?.state.status).toBe('error'))
    expect(result.current.isResolved).toBe(false)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('tells a restore awaiting approval from a returned one', async () => {
    answer({ id: 'c1', belongType: 'RESTORE_HF', status: 'IN_APPROVAL' })
    const { result } = renderHook(() => useLastChange('hf-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.restoreInApproval).toBe(true)
    expect(result.current.restoreReturned).toBe(false)
    expect(result.current.hasOpenChange).toBe(true)

    answer({ id: 'c1', belongType: 'RESTORE_EQP', status: 'IN_PROCESS' })
    const returned = renderHook(() => useLastChange('eq-1', true), { wrapper })

    await waitFor(() => expect(returned.result.current.isResolved).toBe(true))
    expect(returned.result.current.restoreReturned).toBe(true)
    expect(returned.result.current.restoreInApproval).toBe(false)
  })

  it('does not count a completed change as open', async () => {
    answer({ id: 'c1', belongType: 'DEREGISTER_HF', status: 'COMPLETED' })
    const { result } = renderHook(() => useLastChange('hf-1', true), { wrapper })

    await waitFor(() => expect(result.current.isResolved).toBe(true))
    expect(result.current.hasOpenChange).toBe(false)
    expect(result.current.restoreInApproval).toBe(false)
  })

  it('asks nothing until enabled', () => {
    renderHook(() => useLastChange('hf-1', false), { wrapper })

    expect(get).not.toHaveBeenCalled()
  })
})
