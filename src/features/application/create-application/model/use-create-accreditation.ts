import { AccreditationDtoSchema, CreateAccreditationDTO } from '@/entities/create-application';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data';
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

  const accreditationSphereOptions = useMemo(() => {
    return ACCREDITATION_SPHERE_OPTIONS.map((option) => ({
      id: option.id,
      name: `${option.point} - ${option.name}`,
    }));
  }, []);

  return {
    form,
    accreditationSphereOptions,
    t,
  };
};
