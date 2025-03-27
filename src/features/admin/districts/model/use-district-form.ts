import { useForm } from 'react-hook-form';
import { UIModeEnum } from '@/shared/types/ui-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
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
  regionId: '',
};

export function useDistrictForm() {
  const { mode, data, onClose } = useDistrictDrawer();

  const isCreate = mode === UIModeEnum.CREATE;
  const districtId = useMemo(() => (data?.id ? data?.id : 0), [data]);

  const form = useForm<CreateDistrictDTO>({
    resolver: zodResolver(districtSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data: regions } = useRegionSelectQuery();

  const { mutateAsync: createRegion, isPending: isCreating } =
    useCreateDistrict();

  const { mutateAsync: updateRegion, isPending: isUpdating } =
    useUpdateDistrict();

  const { data: districtData, isLoading } = useDistrictQuery(districtId);

  useEffect(() => {
    if (districtData && !isCreate) {
      form.reset({ ...districtData, regionId: String(districtData.regionId) });
    }
  }, [districtData, form]);

  const handleClose = useCallback(() => {
    onClose();
    form.reset(DEFAULT_FORM_VALUES);
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
