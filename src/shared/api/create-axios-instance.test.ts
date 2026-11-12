import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { toast } from 'sonner'
import { createApiClient } from './create-api-client'
import { createAxiosInstance } from './create-axios-instance'

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))
vi.mock('@/shared/config/navigation', () => ({ goToGuestLanding: vi.fn() }))

/** A client whose every request fails with `status`, as the backend would answer */
const failingClient = (status: number) => {
  const instance = createAxiosInstance('http://backend.test')

  instance.defaults.adapter = (config: InternalAxiosRequestConfig) =>
    Promise.reject(
      new AxiosError('failed', 'ERR_BAD_REQUEST', config, null, {
        status,
        statusText: '',
        headers: {},
        config,
        data: { message: 'O‘zgarish so‘rovi topilmadi!' },
      })
    )

  return createApiClient(instance)
}

beforeEach(() => {
  vi.mocked(toast.error).mockClear()
})

describe('the error toast', () => {
  it('is shown for a failed request', async () => {
    await expect(failingClient(404).get('/changes/by-belong/1')).rejects.toMatchObject({ status: 404 })

    expect(toast.error).toHaveBeenCalledWith('O‘zgarish so‘rovi topilmadi!', { richColors: true })
  })

  it('is left out for a status the request names, the error still reaching the caller', async () => {
    await expect(
      failingClient(404).get('/changes/by-belong/1', undefined, undefined, undefined, { silentErrorStatuses: [404] })
    ).rejects.toMatchObject({ status: 404 })

    expect(toast.error).not.toHaveBeenCalled()
  })

  it('is still shown for a status the request does not name', async () => {
    await expect(
      failingClient(500).get('/changes/by-belong/1', undefined, undefined, undefined, { silentErrorStatuses: [404] })
    ).rejects.toMatchObject({ status: 500 })

    expect(toast.error).toHaveBeenCalledWith('O‘zgarish so‘rovi topilmadi!', { richColors: true })
  })
})
