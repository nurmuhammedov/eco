import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPdf } from '../api/create-application';

export type FormData = any;

export interface UseApplicationCreationProps {
  pdfEndpoint: string;
  submitEndpoint: string;
  onError?: (error: string) => void;
}

export function useApplicationCreation({ pdfEndpoint, onError, submitEndpoint }: UseApplicationCreationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(null);

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleError = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    },
    [onError],
  );

  // Generate PDF by form data
  const createPdfMutation = useMutation({
    mutationFn: (data: FormData) => createPdf(data, pdfEndpoint),
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        handleError('PDF yaratishda xatolik');
        setIsPdfLoading(false);
        return;
      }

      try {
        if (!response.success || !response.data) {
          throw new Error('Hujjat URLini olishda xatolik');
        }

        setDocumentUrl(response.data.data);
      } catch (error) {
        handleError(error.message);
      } finally {
        setIsPdfLoading(false);
      }
    },
    onError: (error: Error) => {
      handleError(error.message || 'PDF yaratishda xatolik');
      setIsPdfLoading(false);
    },
  });

  const handleCreateApplication = useCallback(
    (data: FormData) => {
      setFormData(data);
      setIsModalOpen(true);
      setIsPdfLoading(true);
      setError(null);

      createPdfMutation.mutate(data);
    },
    [createPdfMutation],
  );

  const handleCloseModal = useCallback(() => {
    resetState();
    setIsModalOpen(false);
  }, []);

  const resetState = useCallback(() => {
    setIsModalOpen(false);
    setDocumentUrl(null);
    setFormData(null);
    setError(null);
  }, []);

  const isLoading = isPdfLoading;

  return {
    error,
    formData,
    isLoading,
    resetState,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    submitEndpoint,
    handleCloseModal,
    handleCreateApplication,
  };
}
