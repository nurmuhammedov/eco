// src/features/accreditation/create/model/use-re-register-accreditation.ts

import { ReAccreditationDTO, ReAccreditationDtoSchema } from '@/entities/accreditation/models/accreditation.schema.ts';
import { API_ENDPOINTS } from '@/shared/api';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data';
import { useEIMZO } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useReRegisterAccreditation = () => {
  const { t } = useTranslation('accreditation');
  const form = useForm<ReAccreditationDTO>({
    resolver: zodResolver(ReAccreditationDtoSchema),
    mode: 'onChange',
  });

  const {
    error,
    isLoading,
    documentUrl = '',
    isModalOpen,
    isPdfLoading,
    handleCloseModal,
    handleCreateApplication,
    submitApplicationMetaData,
  } = useEIMZO({
    pdfEndpoint: API_ENDPOINTS.APPEALS_RE_ACCREDITATION_GENERATE_PDF,
    submitEndpoint: API_ENDPOINTS.APPEALS_RE_ACCREDITATION,
    queryKey: 're-accreditation-applications',
    successMessage: 'Qayta akkreditatsiya uchun ariza muvaffaqiyatli yuborildi',
    onSuccessNavigateTo: '/accreditations',
  });

  const accreditationSphereOptions = useMemo(() => {
    return ACCREDITATION_SPHERE_OPTIONS.map((option) => ({
      id: option.id,
      name: `${option.point} - ${option.name}`,
    }));
  }, []);

  const onSubmit = (data: ReAccreditationDTO) => {
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
