import { useState } from 'react';
import { createPdf } from '../api/create-pdf.ts';
import { useMutation } from '@tanstack/react-query';
import { signDocument } from '../api/sign-document.ts';
import { getDocumentUrl } from '../api/get-document-url.ts';
import { createApplication } from '../api/create-application.ts';

export function useApplicationCreation(submitEndpoint = '/create-application') {
  // Modal va jarayon holati
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'view' | 'signed' | 'submitted'>('view');
  const [error, setError] = useState<string | null>(null);

  // So'rov natijalari
  const [filePath, setFilePath] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [sign, setSign] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  // Loading holatlari
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isSignLoading, setIsSignLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Ariza yaratish
  const createPdfMutation = useMutation({
    mutationFn: createPdf,
    onSuccess: async (response) => {
      if (!response.success || !response.filePath) {
        setError(response.error || 'PDF yaratishda xatolik');
        setIsPdfLoading(false);
        return;
      }

      setFilePath(response.filePath);

      // PDF URL olish
      try {
        const documentResponse = await getDocumentUrl(response.filePath);
        if (!documentResponse.success || !documentResponse.documentUrl) {
          throw new Error(documentResponse.error || 'Hujjat URL sini olishda xatolik');
        }

        setDocumentUrl(documentResponse.documentUrl);
        setCurrentStep('view');
      } catch (error) {
        setError(error.message);
      } finally {
        setIsPdfLoading(false);
      }
    },
    onError: (error) => {
      setError(error.message || 'PDF yaratishda xatolik');
      setIsPdfLoading(false);
    },
  });

  // Hujjatni imzolash
  const signDocumentMutation = useMutation({
    mutationFn: signDocument,
    onSuccess: (response) => {
      if (!response.success || !response.sign) {
        setError(response.error || 'Hujjatni imzolashda xatolik');
        setIsSignLoading(false);
        return;
      }

      setSign(response.sign);
      setCurrentStep('signed');
      setIsSignLoading(false);
    },
    onError: (error) => {
      setError(error.message || 'Hujjatni imzolashda xatolik');
      setIsSignLoading(false);
    },
  });

  // Arizani yuborish
  const createApplicationMutation = useMutation({
    mutationFn: (params: { formData: FormData; filePath: string; sign: string }) =>
      createApplication(params.formData, params.filePath, params.sign, submitEndpoint),
    onSuccess: (response) => {
      if (!response.success) {
        setError(response.error || 'Arizani yaratishda xatolik');
        setIsSubmitLoading(false);
        return;
      }

      setCurrentStep('submitted');
      setIsSubmitLoading(false);
    },
    onError: (error) => {
      setError(error.message || 'Arizani yuborishda xatolik');
      setIsSubmitLoading(false);
    },
  });

  // Form ma'lumotlarini yuborish va PDF yaratish
  const handleCreateApplication = (data: FormData) => {
    setFormData(data);
    setIsModalOpen(true);
    setIsPdfLoading(true);
    setError(null);

    createPdfMutation.mutate(data);
  };

  // Faylni imzolash
  const handleSignDocument = () => {
    if (!filePath) {
      setError('Imzolanadigan fayl mavjud emas');
      return;
    }

    setIsSignLoading(true);
    setError(null);

    signDocumentMutation.mutate(filePath);
  };

  // Arizani yuborish
  const handleSubmitApplication = () => {
    if (!formData || !filePath || !sign) {
      setError("Kerakli ma'lumotlar mavjud emas");
      return;
    }

    setIsSubmitLoading(true);
    setError(null);

    createApplicationMutation.mutate({
      formData,
      filePath,
      sign,
    });
  };

  // Formaga qaytish
  const handleEditForm = () => {
    setIsModalOpen(false);
    setDocumentUrl(null);
    setError(null);
  };

  // Modaldan chiqish
  const handleCloseModal = () => {
    if (currentStep === 'submitted') {
      // Muvaffaqiyatli yakunlanganda barcha ma'lumotlarni tozalash
      setIsModalOpen(false);
      setFilePath(null);
      setDocumentUrl(null);
      setSign(null);
      setFormData(null);
      setCurrentStep('view');
      setError(null);
    } else {
      setIsModalOpen(false);
    }
  };

  // Hujjatni yuklab olish
  const handleDownloadDocument = () => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

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

    // Event handlerlar
    handleCreateApplication,
    handleSignDocument,
    handleSubmitApplication,
    handleEditForm,
    handleCloseModal,
    handleDownloadDocument,
  };
}
