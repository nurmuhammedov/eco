import { createPdf } from '@/shared/api/create-pdf'
import { apiClient } from '@/shared/api/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

/** The form values rendered into the document and sent along with its signature */
export type SignablePayload = Record<string, unknown>

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null

/** Endpoints disagree on where the generated file's address sits, so it is looked for by name at any depth */
const findString = (value: unknown, keys: string[]): string | null => {
  const record = asRecord(value)
  if (!record) return null

  for (const key of keys) {
    const found = record[key]
    if (typeof found === 'string' && found) return found
  }

  for (const nested of Object.values(record)) {
    const found = findString(nested, keys)
    if (found) return found
  }

  return null
}

export interface UseApplicationCreationProps<TPayload extends object = SignablePayload> {
  pdfEndpoint: string
  pdfMethod?: 'get' | 'post'
  submitEndpoint: string
  onSuccessNavigateTo?: string
  successMessage?: string
  onEnd?: () => void
  /** The endpoint whose lists and details go stale once the document is signed. */
  invalidates: string
  transformSubmitPayload?: (dto: TPayload | null, sign: string, filePath: string | null) => object
}

export function useEimzo<TPayload extends object = SignablePayload>({
  pdfEndpoint,
  pdfMethod = 'post',
  submitEndpoint,
  onSuccessNavigateTo,
  successMessage,
  onEnd,
  invalidates,
  transformSubmitPayload,
}: UseApplicationCreationProps<TPayload>) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [hashCode, setHashCode] = useState<string | null>(null)
  const [formData, setFormData] = useState<TPayload | null>(null)

  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    toast.error(errorMessage, { richColors: true })
  }, [])

  const createPdfMutation = useMutation({
    mutationFn: (data: TPayload) => createPdf(data, pdfEndpoint, pdfMethod),
    onSuccess: (response) => {
      setIsPdfLoading(false)
      const body = asRecord(response.data)
      const bodyMessage = typeof body?.message === 'string' ? body.message : undefined

      let url = findString(response.data, ['filePath', 'url', 'documentUrl'])
      if (!url && typeof response.data === 'string') url = response.data
      if (!url && typeof body?.data === 'string') url = body.data

      // Some endpoints (notifications, for one) put the address in the message
      if (!url && bodyMessage && (bodyMessage.includes('/') || bodyMessage.endsWith('.pdf'))) {
        url = bodyMessage
      }

      if (!response.success || !response.data || !url) {
        handleError(response.message || bodyMessage || 'PDF yaratishda xatolik!')
        return
      }
      try {
        setDocumentUrl(url)
        setHashCode(findString(response.data, ['hashCode']))
      } catch (_error) {
        handleError('Hujjat URL ini olishda xatolik!')
      }
    },
    onError: (error: Error) => {
      setIsPdfLoading(false)
      handleError(error.message || 'PDF yaratishda serverda noma’lum xatolik yuz berdi!')
    },
  })

  const handleCreateApplication = useCallback(
    (data: TPayload) => {
      setFormData(data)
      setIsModalOpen(true)
      setIsPdfLoading(true)
      setError(null)
      createPdfMutation.mutate(data)
    },
    [createPdfMutation]
  )

  const handleAsyncCreateApplication = useCallback(
    async (data: TPayload) => {
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
    onSuccess: (response) => {
      if (response.success) {
        resetState()
        if (onSuccessNavigateTo) {
          navigate(onSuccessNavigateTo)
        }
        toast.success(successMessage || 'Muvaffaqiyatli saqlandi!')
        onEnd?.()
        void invalidateEndpoint(queryClient, invalidates)
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
