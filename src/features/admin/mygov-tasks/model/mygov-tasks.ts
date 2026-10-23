import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

export const MYGOV_TASKS_ENDPOINT = '/mygov-tasks'

export type MygovTaskStatus = 'CREATED' | 'ACCEPT_FAILED' | 'ACCEPTED' | 'ANSWERED' | 'ANSWER_FAILED'

export type MygovServiceType = 'HF' | 'ACCREDITATION' | 'DECLARATION'

export interface MygovTask {
  id: string
  taskId: string
  serviceType: MygovServiceType
  status: MygovTaskStatus
  errorMessage: string | null
  isPaid: boolean
  appealId: string | null
  createdAt: string
  updatedAt: string | null
}

export const STATUS_LABELS: Record<MygovTaskStatus, { label: string; className: string }> = {
  CREATED: { label: 'Yaratilgan', className: 'border-gray-200 bg-gray-100 text-gray-700' },
  ACCEPT_FAILED: { label: 'Qabul qilishda xatolik', className: 'border-red-200 bg-red-50 text-red-700' },
  ACCEPTED: { label: 'Qabul qilindi', className: 'border-blue-200 bg-blue-50 text-blue-700' },
  ANSWERED: { label: 'Javob berildi', className: 'border-green-200 bg-green-50 text-green-700' },
  ANSWER_FAILED: { label: 'Javob berishda xatolik', className: 'border-red-200 bg-red-50 text-red-700' },
}

export const SERVICE_TYPE_LABELS: Record<MygovServiceType, string> = {
  HF: 'Xavfli ishlab chiqarish obyektini ro‘yxatga olish',
  ACCREDITATION: 'Akkreditatsiya',
  DECLARATION: 'Sanoat xavfsizligi deklaratsiyasi',
}

/** Only a failed step can be run again: taking the task in, or sending the result back */
export const RETRYABLE: MygovTaskStatus[] = ['ACCEPT_FAILED', 'ANSWER_FAILED']

const SUCCESS: MygovTaskStatus[] = ['ACCEPTED', 'ANSWERED']

/**
 * The retry talks to my.gov.uz while the request waits, and a 200 only means it
 * was tried - the new status in `data` tells whether it went through.
 */
export const useRetryMygovTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) =>
      (await apiClient.post<{ data?: MygovTaskStatus }>(`${MYGOV_TASKS_ENDPOINT}/${id}/retry`)).data?.data,
    onSuccess: (status) => {
      if (status && SUCCESS.includes(status)) {
        toast.success('So‘rov muvaffaqiyatli qayta yuborildi', { richColors: true })
      } else {
        toast.warning('Qayta yuborishda yana xatolik yuz berdi', { richColors: true })
      }
    },
    // A failed retry (400/404) may also have moved the row on, so the list is
    // refreshed whatever happened
    onSettled: () => invalidateEndpoint(queryClient, MYGOV_TASKS_ENDPOINT),
  })
}
