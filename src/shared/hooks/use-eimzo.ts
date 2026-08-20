import { createPdf } from '@/features/application/create-application/api/create-application'
import { apiClient } from '@/shared/api/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export type FormData = any

export interface UseApplicationCreationProps {
  pdfEndpoint: string
  pdfMethod?: 'get' | 'post'
  submitEndpoint: string
  onSuccessNavigateTo?: string
  successMessage?: string
  onEnd?: () => void
  queryKey: string | any[]
  transformSubmitPayload?: (dto: any, sign: string, filePath: string | null) => any
}

export function useEimzo({
  pdfEndpoint,
  pdfMethod = 'post',
  submitEndpoint,
  onSuccessNavigateTo,
  successMessage,
  onEnd,
  queryKey,
  transformSubmitPayload,
}: UseApplicationCreationProps) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [hashCode, setHashCode] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>(null)

  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    toast.error(errorMessage, { richColors: true })
  }, [])

  const createPdfMutation = useMutation({
    mutationFn: (data: FormData) => createPdf(data, pdfEndpoint, pdfMethod),
    onSuccess: (response) => {
      setIsPdfLoading(false)
      const findKey = (obj: any, keys: string[]): any => {
        if (typeof obj !== 'object' || obj === null) return null
        for (const key of keys) {
          if (key in obj && obj[key]) return obj[key]
        }
        for (const k in obj) {
          const val = findKey(obj[k], keys)
          if (val) return val
        }
        return null
      }

      let url = findKey(response.data, ['filePath', 'url', 'documentUrl'])
      if (!url && typeof response.data === 'string') url = response.data
      if (!url && typeof response.data?.data === 'string') url = response.data.data

      // Ba'zi endpointlar (masalan, notification) URL manzilini message ichida qaytaradi
      if (
        !url &&
        typeof response.data?.message === 'string' &&
        (response.data.message.includes('/') || response.data.message.endsWith('.pdf'))
      ) {
        url = response.data.message
      }

      if (!response.success || !response.data || !url) {
        handleError(response.message || response.data?.message || 'PDF yaratishda xatolik!')
        return
      }
      try {
        setDocumentUrl(url)
        setHashCode(findKey(response.data, ['hashCode']))
      } catch (_error) {
        handleError('Hujjat URL ini olishda xatolik!')
      }
    },
    onError: (error: Error) => {
      setIsPdfLoading(false)
      handleError(error.message || 'PDF yaratishda serverda nomaʼlum xatolik yuz berdi!')
    },
  })

  const handleCreateApplication = useCallback(
    (data: FormData) => {
      setFormData(data)
      setIsModalOpen(true)
      setIsPdfLoading(true)
      setError(null)
      createPdfMutation.mutate(data)
    },
    [createPdfMutation]
  )

  const handleAsyncCreateApplication = useCallback(
    async (data: FormData) => {
      setFormData(data)
      setIsModalOpen(true)
      setIsPdfLoading(true)
      setError(null)
      await createPdfMutation.mutateAsync(data)
    },
    [createPdfMutation]
  )

  const resetState = useCallback(() => {
    setIsModalOpen(false)
    setDocumentUrl(null)
    setHashCode(null)
    setFormData(null)
    setError(null)
    setIsPdfLoading(false)
  }, [])

  const handleCloseModal = useCallback(() => {
    resetState()
  }, [resetState])

  const { mutate: submitApplicationMetaData, isPending: isLoadingMetaData } = useMutation({
    mutationFn: (sign: string) => {
      const payload = transformSubmitPayload
        ? transformSubmitPayload(formData, sign, documentUrl)
        : { dto: formData, sign, filePath: documentUrl }

      return apiClient.post(submitEndpoint, payload)
    },
    onSuccess: (response: any) => {
      if (response && response.success) {
        resetState()
        if (onSuccessNavigateTo) {
          navigate(onSuccessNavigateTo)
        }
        toast.success(successMessage || 'Muvaffaqiyatli saqlandi!')
        onEnd?.()
        queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] })
      }
    },
    mutationKey: ['submit-application'],
  })

  const isLoading = isPdfLoading || isLoadingMetaData

  return {
    error,
    isLoading,
    resetState,
    documentUrl,
    hashCode,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    handleAsyncCreateApplication,
    submitApplicationMetaData,
  }
}
