// src/features/application/create-application/model/use-application-creation.ts
import { createPdf } from '@/features/application/create-application/api/create-application';
import { apiClient } from '@/shared/api';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type FormData = any;

export interface UseApplicationCreationProps {
  pdfEndpoint: string;
  submitEndpoint: string;
  onSuccessNavigateTo?: string;
  successMessage?: string;
}

export function useEIMZO({
  pdfEndpoint,
  submitEndpoint,
  onSuccessNavigateTo,
  successMessage,
}: UseApplicationCreationProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(null);

  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage, { richColors: true });
  }, []);

  const createPdfMutation = useMutation({
    mutationFn: (data: FormData) => createPdf(data, pdfEndpoint),
    onSuccess: (response) => {
      setIsPdfLoading(false);
      if (!response.success || !response.data || !response.data.data) {
        handleError(response.message || 'PDF yaratishda xatolik');
        return;
      }
      try {
        setDocumentUrl(response.data.data);
      } catch (_error) {
        handleError('Hujjat URL ini olishda xatolik');
      }
    },
    onError: (error: Error) => {
      setIsPdfLoading(false);
      handleError(error.message || 'PDF yaratishda noma’lum server xatoligi');
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

  const resetState = useCallback(() => {
    setIsModalOpen(false);
    setDocumentUrl(null);
    setFormData(null);
    setError(null);
    setIsPdfLoading(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    resetState();
  }, [resetState]);

  const { mutate: submitApplicationMetaData, isPending: isLoadingMetaData } = useMutation({
    mutationFn: (sign: string) => apiClient.post(submitEndpoint, { dto: formData, sign, filePath: documentUrl }),
    onSuccess: (response: any) => {
      if (response && response.success) {
        resetState();
        if (onSuccessNavigateTo) {
          navigate(onSuccessNavigateTo);
        }
        toast.success(successMessage || 'Ariza muvaffaqqiyatli yuborildi', { richColors: true });
      } else {
        handleError(response?.message || 'Arizani yuborishda noma’lum xatolik');
      }
    },
    onError: (error: Error) => {
      handleError(error.message || 'Arizani yuborishda server xatoligi');
    },
    mutationKey: ['submit-application'],
  });

  const isLoading = isPdfLoading || isLoadingMetaData;

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
  };
}
