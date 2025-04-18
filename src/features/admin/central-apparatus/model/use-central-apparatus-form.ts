import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useCentralApparatusDrawer } from '@/shared/hooks/entity-hooks';
import {
  centralApparatusSchema,
  CreateCentralApparatusDTO,
  UpdateCentralApparatusDTO,
  useCentralApparatusQuery,
  useCreateCentralApparatus,
  useUpdateCentralApparatus,
} from '@/entities/admin/central-apparatus';

const DEFAULT_FORM_VALUES: CreateCentralApparatusDTO = {
  name: '',
};

export function useCentralApparatusForm() {
  const { data, onClose, isCreate } = useCentralApparatusDrawer();

  const centralApparatusId = useMemo(() => (data?.id ? data?.id : 0), [data]);

  const form = useForm<CreateCentralApparatusDTO>({
    resolver: zodResolver(centralApparatusSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { mutateAsync: createCentralApparatus, isPending: isCreating } = useCreateCentralApparatus();

  const { mutateAsync: updateCentralApparatus, isPending: isUpdating } = useUpdateCentralApparatus();

  const { data: regionData, isLoading } = useCentralApparatusQuery(centralApparatusId);

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
    async (formData: CreateCentralApparatusDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await createCentralApparatus(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await updateCentralApparatus({
            id: centralApparatusId,
            ...formData,
          } as UpdateCentralApparatusDTO);
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
    [isCreate, centralApparatusId, createCentralApparatus, updateCentralApparatus, handleClose],
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
