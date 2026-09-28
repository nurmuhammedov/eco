import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useOwnerLookup } from './use-owner-lookup'

const post = vi.hoisted(() => vi.fn())

vi.mock('@/shared/api/api-client', () => ({ apiClient: { post } }))

beforeEach(() => {
  post.mockReset()
})

describe('useOwnerLookup', () => {
  it('looks an organisation up by its taxpayer number', async () => {
    post.mockResolvedValue({ data: { data: { legalName: 'OOO Test' } } })
    const { result } = renderHook(() => useOwnerLookup())

    act(() => {
      expect(result.current.search('123456789')).toBe(true)
    })

    expect(post).toHaveBeenCalledWith('/integration/iip/legal', { tin: '123456789' })
    await waitFor(() => expect(result.current.owner).toEqual({ legalName: 'OOO Test' }))
    expect(result.current.isSearching).toBe(false)
  })

  it('looks a citizen up by the number and the birth date', async () => {
    post.mockResolvedValue({ data: { data: { fullName: 'Test Testov' } } })
    const { result } = renderHook(() => useOwnerLookup())

    act(() => {
      result.current.search('12345678901234', new Date(1990, 4, 17))
    })

    expect(post).toHaveBeenCalledWith('/integration/iip/individual', {
      pin: '12345678901234',
      birthDate: '1990-05-17',
    })
    await waitFor(() => expect(result.current.owner).toEqual({ fullName: 'Test Testov' }))
  })

  it('does not search when the numbers are not enough', () => {
    const { result } = renderHook(() => useOwnerLookup())

    expect(result.current.search('12345678901234')).toBe(false)
    expect(result.current.search('1234')).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })

  it('asks for organisations only when a citizen cannot own the object', () => {
    const { result } = renderHook(() => useOwnerLookup({ legalOnly: true }))

    expect(result.current.search('12345678901234', new Date(1990, 4, 17))).toBe(false)
    expect(post).not.toHaveBeenCalled()
  })

  it('names the object kind for the radiation registers', () => {
    post.mockResolvedValue({ data: { data: {} } })
    const { result } = renderHook(() => useOwnerLookup({ type: 'IRS' }))

    act(() => {
      result.current.search('123456789')
    })

    expect(post).toHaveBeenCalledWith('/integration/iip/legal', { tin: '123456789', type: 'IRS' })
  })

  it('forgets the owner when the lookup fails or is cleared', async () => {
    post.mockResolvedValueOnce({ data: { data: { legalName: 'OOO Test' } } })
    const { result } = renderHook(() => useOwnerLookup())

    act(() => {
      result.current.search('123456789')
    })
    await waitFor(() => expect(result.current.owner).not.toBeNull())

    post.mockRejectedValueOnce(new Error('not found'))
    act(() => {
      result.current.search('987654321')
    })
    await waitFor(() => expect(result.current.owner).toBeNull())

    act(() => result.current.clear())
    expect(result.current.owner).toBeNull()
  })
})
