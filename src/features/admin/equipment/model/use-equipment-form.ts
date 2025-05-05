import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateEquipmentDTO,
  equipmentSchema,
  UpdateEquipmentDTO,
  useCreateEquipment,
  useEquipmentDetail,
  useUpdateEquipment,
} from '@/entities/admin/equipment';

const DEFAULT_FORM_VALUES: CreateEquipmentDTO = {
  name: '',
  equipmentType: '',
};

export function useEquipmentForm() {
  const { data, onClose, isCreate } = useDistrictDrawer();

  const districtId = useMemo(() => (data?.id ? data?.id : 0), [data]);

  const form = useForm<CreateEquipmentDTO>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { mutateAsync: createRegion, isPending: isCreating } = useCreateEquipment();

  const { mutateAsync: updateRegion, isPending: isUpdating } = useUpdateEquipment();

  const { data: districtData, isLoading } = useEquipmentDetail(districtId);

  useEffect(() => {
    if (districtData && !isCreate) {
      form.reset({ ...districtData, equipmentType: String(districtData.equipmentType) });
    }
  }, [districtData, form]);

  const handleClose = useCallback(() => {
    onClose();
    form.reset(DEFAULT_FORM_VALUES);
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateEquipmentDTO): Promise<boolean> => {
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
          } as UpdateEquipmentDTO);
          if (response.success) {
            handleClose();
            return true;
          }
        }

        return false;
      } catch (error) {
        console.error('[useEquipmentForm] Submission error:', error);
        return false;
      }
    },
    [isCreate, districtId, createRegion, updateRegion, handleClose],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    isCreate,
    isPending,
    districtData,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
