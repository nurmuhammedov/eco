import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import usePaginatedData from './use-paginated-data'
import useServicesPaginatedData from './use-services-paginated-data'
import useDetail from './use-detail'
import useAdd from './use-add'
import useUpdate from './use-update'
import useDelete from './use-delete'

const api = vi.hoisted(() => ({
  getPaginatedData: vi.fn(),
  getDetail: vi.fn(),
  addData: vi.fn(),
  updateData: vi.fn(),
  partialUpdateData: vi.fn(),
  deleteData: vi.fn(),
  getWithPagination: vi.fn(),
}))

vi.mock('@/shared/api/dictionaries/queries/common.api', () => ({ CommonService: api }))
vi.mock('@/shared/api/services-api-client', () => ({
  servicesApiClient: { getWithPagination: api.getWithPagination },
}))
vi.mock('@/shared/hooks/use-auth', () => ({ useAuth: () => ({ user: { role: 'HEAD' } }) }))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

let queryClient: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
})

describe('usePaginatedData', () => {
  it('takes the page count from the envelope', async () => {
    api.getPaginatedData.mockResolvedValue({
      content: [{ id: 1 }],
      page: { size: 10, number: 0, totalElements: 41, totalPages: 5 },
    })

    const { result } = renderHook(() => usePaginatedData('/inquiries', { page: 1, size: 10 }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(5)
    expect(result.current.totalElements).toBe(41)
  })

  it('works the page count out when only a total comes back', async () => {
    api.getPaginatedData.mockResolvedValue({ content: [], totalElements: 21 } as any)

    const { result } = renderHook(() => usePaginatedData('/inquiries', { size: 10 }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(3)
  })

  it('stays busy while the previous page is only standing in for the next one', async () => {
    let resolveSecond: (value: any) => void = () => {}
    api.getPaginatedData
      .mockResolvedValueOnce({ content: [{ id: 1 }], page: { size: 10, number: 0, totalElements: 20, totalPages: 2 } })
      .mockReturnValueOnce(new Promise((resolve) => (resolveSecond = resolve)))

    const { result, rerender } = renderHook(({ page }) => usePaginatedData('/inquiries', { page, size: 10 }), {
      wrapper,
      initialProps: { page: 1 },
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    rerender({ page: 2 })

    // The old rows are kept on screen, but the table must still show it is loading
    expect(result.current.data?.content).toEqual([{ id: 1 }])
    expect(result.current.isLoading).toBe(true)

    act(() => resolveSecond({ content: [{ id: 2 }], page: { size: 10, number: 1, totalElements: 20, totalPages: 2 } }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data?.content).toEqual([{ id: 2 }])
  })
})

describe('useServicesPaginatedData', () => {
  it('reads the Laravel envelope the same way', async () => {
    api.getWithPagination.mockResolvedValue({
      success: true,
      status: 200,
      data: { content: [{ id: 'a' }], page: { size: 20, number: 0, totalElements: 100, totalPages: 5 } },
    })

    const { result } = renderHook(() => useServicesPaginatedData('/attestation/questions', { size: 20 }), { wrapper })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.totalPages).toBe(5)
    expect(api.getWithPagination).toHaveBeenCalledWith('/attestation/questions', { size: 20 })
  })
})

describe('useDetail', () => {
  it('waits for an id instead of asking for "undefined"', () => {
    renderHook(() => useDetail('/inquiries', undefined), { wrapper })

    expect(api.getDetail).not.toHaveBeenCalled()
  })

  it('fetches the record once the id is there', async () => {
    api.getDetail.mockResolvedValue({ id: 7 })

    const { result } = renderHook(() => useDetail('/inquiries', 7), { wrapper })

    await waitFor(() => expect(result.current.detail).toEqual({ id: 7 }))
    expect(api.getDetail).toHaveBeenCalledWith('/inquiries', '7', undefined)
  })
})

/** Seeds one cached query per endpoint so a test can see which ones went stale */
const seed = (...endpoints: string[]) =>
  endpoints.forEach((endpoint) => queryClient.setQueryData(endpointKey(endpoint, { page: 1 }), { seeded: true }))

const isStale = (endpoint: string) => queryClient.getQueryState(endpointKey(endpoint, { page: 1 }))?.isInvalidated

describe('mutations refresh what their endpoint feeds', () => {
  it('useAdd marks the list and its details stale, and nothing else', async () => {
    api.addData.mockResolvedValue({})
    seed('/hf', '/hf/12', '/inquiries')

    const { result } = renderHook(() => useAdd('/hf'), { wrapper })
    await act(() => result.current.mutateAsync({ name: 'x' }))

    expect(isStale('/hf')).toBe(true)
    expect(isStale('/hf/12')).toBe(true)
    expect(isStale('/inquiries')).toBe(false)
  })

  it('treats a leading slash as the same endpoint', async () => {
    api.addData.mockResolvedValue({})
    seed('hf')

    const { result } = renderHook(() => useAdd('/hf'), { wrapper })
    await act(() => result.current.mutateAsync({ name: 'x' }))

    expect(isStale('hf')).toBe(true)
  })

  it('useUpdate sends nothing while the id is still missing', async () => {
    const { result } = renderHook(() => useUpdate('/hf', undefined), { wrapper })

    await expect(result.current.mutateAsync({ name: 'x' })).rejects.toThrow('identifikator berilmagan')
    expect(api.updateData).not.toHaveBeenCalled()
  })

  it('useUpdate accepts 0 as an id and picks the method', async () => {
    api.partialUpdateData.mockResolvedValue({})

    const { result } = renderHook(() => useUpdate('/hf', 0, 'patch'), { wrapper })
    await act(() => result.current.mutateAsync({ name: 'x' }))

    expect(api.partialUpdateData).toHaveBeenCalledWith('/hf', { name: 'x' }, '0')
    expect(api.updateData).not.toHaveBeenCalled()
  })

  it('useDelete prefers the row id over the one fixed at setup', async () => {
    api.deleteData.mockResolvedValue(undefined)
    seed('/hf')

    const { result } = renderHook(() => useDelete('/hf', 'fixed'), { wrapper })
    await act(() => result.current.mutateAsync('row'))

    expect(api.deleteData).toHaveBeenCalledWith('/hf', 'row')
    expect(isStale('/hf')).toBe(true)
  })

  it('useDelete refuses to run without any id', async () => {
    const { result } = renderHook(() => useDelete('/hf'), { wrapper })

    await expect(result.current.mutateAsync(undefined)).rejects.toThrow('identifikator berilmagan')
    expect(api.deleteData).not.toHaveBeenCalled()
  })
})
