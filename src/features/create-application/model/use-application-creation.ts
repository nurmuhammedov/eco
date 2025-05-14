// src/processes/application-creation/model.ts
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createApplication, createPdf, signDocument } from '../api/create-application';
import { getSignatureKeys } from '@/shared/lib';

export type ApplicationStep = 'view' | 'signed' | 'submitted';
export type FormData = any; // Formaga qarab tipini o'zgartiring

export interface UseApplicationCreationProps {
  pdfEndpoint?: string;
  submitEndpoint?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useApplicationCreation({
  pdfEndpoint = '/appeals/hf/generate-pdf',
  submitEndpoint = '/create-application',
  onSuccess,
  onError,
}: UseApplicationCreationProps = {}) {
  const { signatureKeys } = getSignatureKeys();

  // Modal va jarayon holati
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('view');
  const [error, setError] = useState<string | null>(null);

  // So'rov natijalari
  const [filePath, setFilePath] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [sign, setSign] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(null);

  // Loading holatlari
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isSignLoading, setIsSignLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Xatoliklarni qayta ishlash
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
        setIsSubmitLoading(false);
        return;
      }

      setCurrentStep('submitted');
      setIsSubmitLoading(false);

      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      handleError(error.message || 'Arizani yuborishda xatolik');
      setIsSubmitLoading(false);
    },
  });

  // Hujjatni imzolash - Muvaffaqiyatli bo'lganda, arizani yuborish funktsiyasini chaqiradi
  const signDocumentMutation = useMutation({
    mutationFn: signDocument,
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        handleError('Hujjatni imzolashda xatolik');
        setIsSignLoading(false);
        return;
      }

      setSign(response.data);
      setCurrentStep('signed');
      setIsSignLoading(false);
    },
    onError: (error: Error) => {
      handleError(error.message || 'Hujjatni imzolashda xatolik');
      setIsSignLoading(false);
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
        setCurrentStep('view');
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

    setIsSignLoading(true);
    setError(null);

    signDocumentMutation.mutate(filePath);
  }, [filePath, handleError, signDocumentMutation]);

  // Arizani yuborish - faqat imzolash tugmasi bosish orqali sign qiymati olingan keyin chaqiriladi
  const handleSubmitApplication = useCallback(() => {
    if (!formData || !filePath || !sign) {
      handleError("Kerakli ma'lumotlar mavjud emas");
      return;
    }

    setIsSubmitLoading(true);
    setError(null);

    createApplicationMutation.mutate({
      formData,
      filePath,
      sign,
    });
  }, [formData, filePath, sign, handleError, createApplicationMutation]);

  // Formaga qaytish
  const handleEditForm = useCallback(() => {
    setIsModalOpen(false);
    setDocumentUrl(null);
    setError(null);
  }, []);

  // Modaldan chiqish
  const handleCloseModal = useCallback(() => {
    if (currentStep === 'submitted') {
      // Muvaffaqiyatli yakunlanganda barcha ma'lumotlarni tozalash
      resetState();
    } else {
      setIsModalOpen(false);
    }
  }, [currentStep]);

  // Barcha ma'lumotlarni tozalash
  const resetState = useCallback(() => {
    setIsModalOpen(false);
    setFilePath(null);
    setDocumentUrl(null);
    setSign(null);
    setFormData(null);
    setCurrentStep('view');
    setError(null);
  }, []);

  // Hujjatni yuklab olish
  const handleDownloadDocument = useCallback(() => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }, [documentUrl]);

  // Loading holati
  const isLoading = isPdfLoading || isSignLoading || isSubmitLoading;

  return {
    // Holatlar
    isModalOpen,
    isLoading,
    isPdfLoading,
    isSignLoading,
    isSubmitLoading,
    currentStep,
    error,
    documentUrl,
    filePath,
    sign,
    formData,

    // Event handlerlar
    handleCreateApplication,
    handleSignDocument,
    handleSubmitApplication,
    handleEditForm,
    handleCloseModal,
    handleDownloadDocument,
    resetState,
  };
}
