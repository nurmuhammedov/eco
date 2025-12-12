import { toast } from 'sonner'
import { apiClient } from '@/shared/api/api-client'
import { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createPdf } from '../api/create-application'
import { useNavigate } from 'react-router-dom'

export type FormData = any

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
  const [formData, setFormData] = useState<FormData>(null)

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
    mutationFn: (data: FormData) => createPdf(data, pdfEndpoint),
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

        setDocumentUrl(response.data.data)
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
    (data: FormData) => {
      setFormData(data)
      setIsModalOpen(true)
      setIsPdfLoading(true)
      setError(null)
      createPdfMutation.mutate(data)
    },
    [createPdfMutation]
  )

  const handleCloseModal = useCallback(() => {
    resetState()
    setIsModalOpen(false)
  }, [])

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
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  }
}
