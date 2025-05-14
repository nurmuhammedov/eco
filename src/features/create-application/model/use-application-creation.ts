import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createApplication, createPdf, signDocument } from '../api/create-application';

export type FormData = any;

export interface UseApplicationCreationProps {
  pdfEndpoint?: string;
  submitEndpoint?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useApplicationCreation({
  pdfEndpoint,
  submitEndpoint,
  onSuccess,
  onError,
}: UseApplicationCreationProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filePath, setFilePath] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [sign, setSign] = useState<string | null>(null);
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

  // Arizani yuborish - Faqat imzolash muvaffaqiyatli bo'lgandan keyin chaqiriladi
  const createApplicationMutation = useMutation({
    mutationFn: (params: { formData: FormData; filePath: string; sign: string }) =>
      createApplication(params.formData, params.filePath, params.sign, submitEndpoint),
    onSuccess: (response) => {
      if (!response.success) {
        handleError(response.error || 'Arizani yaratishda xatolik');
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      handleError(error.message || 'Arizani yuborishda xatolik');
    },
  });

  // Hujjatni imzolash - Muvaffaqiyatli bo'lganda, arizani yuborish funktsiyasini chaqiradi
  const signDocumentMutation = useMutation({
    mutationFn: signDocument,
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        handleError('Hujjatni imzolashda xatolik');
        return;
      }

      setSign(response.data);
    },
    onError: (error: Error) => {
      handleError(error.message || 'Hujjatni imzolashda xatolik');
    },
  });

  // Ariza yaratish
  const createPdfMutation = useMutation({
    mutationFn: (data: FormData) => createPdf(data, pdfEndpoint),
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        handleError('PDF yaratishda xatolik');
        setIsPdfLoading(false);
        return;
      }

      setFilePath(response.data);

      // PDF URL olish
      try {
        if (!response.success || !response.data) {
          throw new Error('Hujjat URL sini olishda xatolik');
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

  // Form ma'lumotlarini yuborish va PDF yaratish
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

  // Faylni imzolash
  const handleSignDocument = useCallback(() => {
    if (!filePath) {
      handleError('Imzolanadigan fayl mavjud emas');
      return;
    }
    setError(null);

    signDocumentMutation.mutate(filePath);
  }, [filePath, handleError, signDocumentMutation]);

  const handleSubmitApplication = useCallback(() => {
    if (!formData || !filePath || !sign) {
      handleError("Kerakli ma'lumotlar mavjud emas");
      return;
    }

    setError(null);

    createApplicationMutation.mutate({
      formData,
      filePath,
      sign,
    });
  }, [formData, filePath, sign, handleError, createApplicationMutation]);

  const handleCloseModal = useCallback(() => {
    resetState();
    setIsModalOpen(false);
  }, []);

  const resetState = useCallback(() => {
    setIsModalOpen(false);
    setFilePath(null);
    setDocumentUrl(null);
    setSign(null);
    setFormData(null);
    setError(null);
  }, []);

  // Hujjatni yuklab olish
  const handleDownloadDocument = useCallback(() => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }, [documentUrl]);

  // Loading holati
  const isLoading = isPdfLoading;

  return {
    // Holatlar
    isModalOpen,
    isLoading,
    isPdfLoading,
    error,
    documentUrl,
    filePath,
    sign,
    formData,
    handleCreateApplication,
    handleSignDocument,
    handleSubmitApplication,
    handleCloseModal,
    handleDownloadDocument,
    resetState,
  };
}
