import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateRegionDTO,
  regionSchema,
  UpdateRegionDTO,
  useCreateRegion,
  useRegionQuery,
  useUpdateRegion,
} from '@/entities/admin/region';

const DEFAULT_FORM_VALUES: CreateRegionDTO = {
  name: '',
  soato: '',
  number: '',
};

export function useRegionForm() {
  const { mode, data, onClose } = useRegionDrawer();

  const isCreate = mode === UIModeEnum.CREATE;
  const regionId = useMemo(() => (data?.id ? data?.id : 0), [data]);

  const form = useForm<CreateRegionDTO>({
    resolver: zodResolver(regionSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { mutateAsync: createRegion, isPending: isCreating } = useCreateRegion();

  const { mutateAsync: updateRegion, isPending: isUpdating } = useUpdateRegion();

  const { data: regionData, isLoading } = useRegionQuery(regionId, {
    enabled: !isCreate && regionId > 0,
  });

  useEffect(() => {
    if (regionData && !isCreate) {
      form.reset(regionData);
    }
  }, [regionData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateRegionDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createRegion(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await updateRegion({
            id: regionId,
            ...formData,
          } as UpdateRegionDTO);
          if (response.success) {
            handleClose();
            return true;
          }
        }

        return false;
      } catch (error) {
        console.error('[useDistrictForm] Submission error:', error);
        return false;
      }
    },
    [isCreate, regionId, createRegion, updateRegion, handleClose],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    isCreate,
    isPending,
    regionData,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
