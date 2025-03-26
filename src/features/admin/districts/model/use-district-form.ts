import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { UIModeEnum } from '@/shared/types/ui-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateDistrictDTO,
  districtSchema,
  UpdateDistrictDTO,
  useCreateDistrict,
  useDistrictQuery,
  useRegionSelectQuery,
  useUpdateDistrict,
} from '@/entities/admin/districts';

const DEFAULT_FORM_VALUES: CreateDistrictDTO = {
  name: '',
  soato: 1,
  number: 1,
  regionId: null,
};

export function useDistrictForm() {
  const { mode, data, onClose } = useRegionDrawer();

  const isCreate = mode === UIModeEnum.CREATE;
  const districtId = data?.id ? Number(data.id) : 0;

  const form = useForm<CreateDistrictDTO>({
    resolver: zodResolver(districtSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { data: regions } = useRegionSelectQuery();

  const { mutateAsync: createRegion, isPending: isCreating } =
    useCreateDistrict();

  const { mutateAsync: updateRegion, isPending: isUpdating } =
    useUpdateDistrict();

  const { data: districtData, isLoading } = useDistrictQuery(districtId, {
    enabled: !isCreate && districtId > 0,
  });

  useEffect(() => {
    if (districtData && !isCreate) {
      form.reset(districtData);
    }
  }, [districtData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateDistrictDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createRegion(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await updateRegion({
            id: districtId,
            ...formData,
          } as UpdateDistrictDTO);
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
    [isCreate, districtId, createRegion, updateRegion, handleClose],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    regions,
    isCreate,
    isPending,
    districtData,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
