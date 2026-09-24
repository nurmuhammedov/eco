import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createPdf } from '@/shared/api/create-pdf'
import { useNavigate } from 'react-router-dom'

/** The form values rendered into the document and sent along with its signature */
export type ApplicationPayload = object

export interface UseApplicationCreationProps {
  pdfEndpoint: string
  submitEndpoint: string
  onError?: (error: string) => void
}

export function useApplicationCreation({ pdfEndpoint, onError, submitEndpoint }: UseApplicationCreationProps) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [documentUrl, setDocumentUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<ApplicationPayload | null>(null)

  const [isPdfLoading, setIsPdfLoading] = useState(false)

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage)
      if (onError) {
        onError(errorMessage)
      }
    },
    [onError]
  )

  // Generate PDF by form data
  const createPdfMutation = useMutation({
    mutationFn: (data: ApplicationPayload) => createPdf(data, pdfEndpoint),
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        handleError('PDF yaratishda xatolik!')
        setIsPdfLoading(false)
        return
      }

      try {
        if (!response.success || !response.data) {
          throw new Error('Hujjat URL ini olishda xatolik!')
        }

        const body = response.data as { data?: unknown }
        if (typeof body.data !== 'string') throw new Error('Hujjat URL ini olishda xatolik!')

        setDocumentUrl(body.data)
      } finally {
        setIsPdfLoading(false)
      }
    },
    onError: (error: Error) => {
      handleError(error.message || 'PDF yaratishda xatolik')
      setIsPdfLoading(false)
    },
  })

  const handleCreateApplication = useCallback(
    (data: ApplicationPayload) => {
      setFormData(data)
      setIsModalOpen(true)
      setIsPdfLoading(true)
      setError(null)
      createPdfMutation.mutate(data)
    },
    [createPdfMutation]
  )

  const resetState = useCallback(() => {
    setIsModalOpen(false)
    setDocumentUrl(null)
    setFormData(null)
    setError(null)
  }, [])

  const { mutate: submitApplicationMetaData, isPending: isLoadingMetaData } = useMutation({
    onSuccess: ({ success }) => {
      if (success) {
        resetState()
        navigate('/applications')
        toast.success('Ariza muvaffaqqiyatli yuborildi')
      }
    },
    mutationKey: ['submit-application'],
    mutationFn: (sign: string) => apiClient.post(submitEndpoint, { dto: formData, sign, filePath: documentUrl }),
  })

  const isLoading = isPdfLoading || isLoadingMetaData

  return {
    error,
    isLoading,
    resetState,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal: resetState,
    handleCreateApplication,
    submitApplicationMetaData,
  }
}
