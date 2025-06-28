import { AccreditationDtoSchema, CreateAccreditationDTO } from '@/entities/create-application';
import { API_ENDPOINTS } from '@/shared/api';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data';
import { useEIMZO } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useCreateAccreditation = () => {
  const { t } = useTranslation('accreditation');
  const form = useForm<CreateAccreditationDTO>({
    resolver: zodResolver(AccreditationDtoSchema),
    mode: 'onChange',
  });

  const {
    error,
    isLoading,
    documentUrl,
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION_GENERATE_PDF,
    submitEndpoint: API_ENDPOINTS.APPEALS_ACCREDITATION,
    queryKey: 'accreditation-applications',
    successMessage: 'Akkreditatsiya arizasi muvaffaqiyatli yuborildi',
    onSuccessNavigateTo: '/accreditations',
  });

  const accreditationSphereOptions = useMemo(() => {
    return ACCREDITATION_SPHERE_OPTIONS.map((option) => ({
      id: option.id,
      name: `${option.point} - ${option.name}`,
    }));
  }, []);

  const onSubmit = (data: CreateAccreditationDTO) => {
    handleCreateApplication(data);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    isModalOpen,
    documentUrl,
    isPdfLoading,
    handleCloseModal,
    submitApplicationMetaData,
    error,
    accreditationSphereOptions,
    t,
  };
};
