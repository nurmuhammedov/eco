import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UploadLegalPermitsExcel } from './upload-legal-permits-excel'

const post = vi.hoisted(() => vi.fn())

vi.mock('@/shared/api/api-client', () => ({ apiClient: { post } }))
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() } }))

let queryClient: QueryClient

const renderButton = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <UploadLegalPermitsExcel />
    </QueryClientProvider>
  )

const workbook = new File(['xlsx'], 'ruxsatnomalar.xlsx', {
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
})

const pickAndUpload = async () => {
  const user = userEvent.setup()
  renderButton()

  await user.click(screen.getByRole('button', { name: /Excel orqali yuklash/ }))
  const upload = screen.getByRole('button', { name: 'Yuklash' })
  expect(upload).toBeDisabled()

  await user.upload(document.querySelector<HTMLInputElement>('input[type="file"]')!, workbook)
  expect(screen.getByText('ruxsatnomalar.xlsx')).toBeInTheDocument()

  await user.click(upload)
}

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  post.mockReset()
  vi.mocked(toast.success).mockReset()
  vi.mocked(toast.warning).mockReset()
})

describe('UploadLegalPermitsExcel', () => {
  it('sends the picked workbook as the multipart "file" and refreshes the permits', async () => {
    post.mockResolvedValue({ success: true, status: 200, data: { message: 'Fayl muvaffaqiyatli yuklandi' } })
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries')

    await pickAndUpload()

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Fayl muvaffaqiyatli yuklandi'))
    const [url, body, headers, , options] = post.mock.calls[0] as [
      string,
      FormData,
      Record<string, string>,
      undefined,
      { silentErrorStatuses: number[] },
    ]
    expect(url).toBe('/permits/legal/excel')
    expect(body.get('file')).toBe(workbook)
    expect(headers).toEqual({ 'Content-Type': 'multipart/form-data' })
    expect(options.silentErrorStatuses).toEqual([504])
    expect(invalidate).toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('reads a gateway timeout as a file still being processed, not as a failure', async () => {
    post.mockRejectedValue({ success: false, status: 504, message: 'Gateway Time-out' })

    await pickAndUpload()

    await waitFor(() => expect(toast.warning).toHaveBeenCalled())
    expect(toast.success).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('keeps the dialog open on any other failure, the interceptor having shown it', async () => {
    post.mockRejectedValue({ success: false, status: 400, message: 'Fayl bo‘sh bo‘lishi mumkin emas' })

    await pickAndUpload()

    await waitFor(() => expect(post).toHaveBeenCalled())
    expect(toast.warning).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
