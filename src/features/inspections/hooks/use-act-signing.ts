import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'

interface NotifyLegalPayload {
  resultId: string
  url: string
}

interface LegalSignPayload {
  resultId: string
  filePath: string
  documentId: string
  sign: string
}

export const buildActSignUrl = (resultId: string) => {
  const params = new URLSearchParams(window.location.search.replace(/&amp;/gi, '&'))
  params.set('signResultId', resultId)
  return `${window.location.pathname}?${params.toString()}`
}

export const useNotifyLegalToSignAct = () =>
  useMutation({
    mutationFn: ({ resultId, url }: NotifyLegalPayload) =>
      apiClient.post(`/inspection-results/${resultId}/notify-sign`, { url }),
    onSuccess: () => toast.success('Yuridik shaxsga dalolatnomani imzolash uchun bildirishnoma yuborildi'),
    onError: (error: any) => toast.error(error?.message || 'Bildirishnoma yuborilmadi', { richColors: true }),
  })

export const useLegalSignAct = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ resultId, filePath, documentId, sign }: LegalSignPayload) =>
      apiClient.post(`/inspection-results/${resultId}/sign-act`, {
        filePath,
        sign,
        dto: { documentId },
      }),
    onSuccess: () => {
      toast.success('Dalolatnoma muvaffaqiyatli imzolandi')
      queryClient.invalidateQueries({ queryKey: ['/inspection-results'] })
      onSuccess?.()
    },
    onError: (error: any) => toast.error(error?.message || 'Dalolatnomani imzolashda xatolik', { richColors: true }),
  })
}
