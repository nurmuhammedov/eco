import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useRegionSelectQuery } from '@/entities/admin/districts';
import { useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateTerritorialDepartmentsDTO,
  territorialDepartmentsSchema,
  UpdateTerritorialDepartmentsDTO,
  useCreateTerritorialDepartment,
  useTerritorialDepartmentQuery,
  useUpdateTerritorialDepartments,
} from '@/entities/admin/territorial-departments';

const DEFAULT_FORM_VALUES: CreateTerritorialDepartmentsDTO = {
  name: '',
  regionIds: [],
};

export function useTerritorialDepartmentsForm() {
  const { data, onClose, isCreate } = useTerritorialDepartmentsDrawer();

  const territorialDepartmentId = useMemo(() => (data?.id ? data?.id : 0), [data]);

  const form = useForm<CreateTerritorialDepartmentsDTO>({
    resolver: zodResolver(territorialDepartmentsSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: 'onChange',
  });

  const { data: regionOptions } = useRegionSelectQuery();

  const { mutateAsync: create, isPending: isCreating } = useCreateTerritorialDepartment();

  const { mutateAsync: update, isPending: isUpdating } = useUpdateTerritorialDepartments();

  const { data: foundedData, isLoading } = useTerritorialDepartmentQuery(territorialDepartmentId);

  useEffect(() => {
    if (foundedData && !isCreate) {
      form.reset(foundedData);
    }
  }, [foundedData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_FORM_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateTerritorialDepartmentsDTO): Promise<boolean> => {
      try {
        if (isCreate) {
          const response = await create(formData);
          if (response.success) {
            handleClose();
            return true;
          }
        } else {
          const response = await update({
            id: territorialDepartmentId,
            ...formData,
          } as UpdateTerritorialDepartmentsDTO);
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
    [isCreate, territorialDepartmentId, create, update, handleClose],
  );

  const isPending = isCreating || isUpdating;

  return {
    form,
    isPending,
    foundedData,
    regionOptions,
    onSubmit: handleSubmit,
    isFetching: isLoading,
  };
}
