// src/features/accreditation/create/model/use-expand-accreditation.ts

import {
  ExpandAccreditationDTO,
  ExpandAccreditationDtoSchema,
} from '@/entities/accreditation/models/accreditation.schema.ts';
import { API_ENDPOINTS } from '@/shared/api';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data';
import { useEIMZO } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useExpandAccreditation = () => {
  const { t } = useTranslation('accreditation');
  const form = useForm<ExpandAccreditationDTO>({
    resolver: zodResolver(ExpandAccreditationDtoSchema),
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
    pdfEndpoint: API_ENDPOINTS.APPEALS_EXPEND_ACCREDITATION_GENERATE_PDF,
    submitEndpoint: API_ENDPOINTS.APPEALS_EXPEND_ACCREDITATION,
    queryKey: 'expand-accreditation-applications',
    successMessage: 'Akkreditatsiya sohasini kengaytirish uchun ariza muvaffaqiyatli yuborildi',
    onSuccessNavigateTo: '/accreditations',
  });

  const accreditationSphereOptions = useMemo(() => {
    return ACCREDITATION_SPHERE_OPTIONS.map((option) => ({
      id: option.id,
      name: `${option.point} - ${option.name}`,
    }));
  }, []);

  const onSubmit = (data: ExpandAccreditationDTO) => {
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
