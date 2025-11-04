import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useCategoryTypeDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateCategoryTypeDTO,
  categoryTypeSchema,
  UpdateCategoryTypeDTO,
  useCreateCategoryType,
  useCategoryTypeQuery,
  useUpdateCategoryType,
} from '@/entities/admin/inspection/';

const DEFAULT_VALUES: CreateCategoryTypeDTO = {
  category: '',
  type: '',
};

export function useCategoryTypeForm() {
  const { data, onClose, isCreate } = useCategoryTypeDrawer();
  const categoryTypeId = useMemo(() => (data?.id ? data.id : 0), [data]);

  const form = useForm<CreateCategoryTypeDTO>({
    resolver: zodResolver(categoryTypeSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const { mutateAsync: createItem, isPending: isCreating } = useCreateCategoryType();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateCategoryType();
  const { data: categoryTypeData, isLoading } = useCategoryTypeQuery(categoryTypeId);

  useEffect(() => {
    if (categoryTypeData && !isCreate) {
      form.reset(categoryTypeData);
    }
  }, [categoryTypeData, isCreate, form]);

  const handleClose = useCallback(() => {
    form.reset(DEFAULT_VALUES);
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateCategoryTypeDTO): Promise<boolean> => {
      try {
        const response = isCreate
          ? await createItem(formData)
          : await updateItem({ id: categoryTypeId, ...formData } as UpdateCategoryTypeDTO);

        if (response.success) {
          handleClose();
          return true;
        }
        return false;
      } catch (error) {
        console.error('[useCategoryTypeForm] Submission error:', error);
        return false;
      }
    },
    [isCreate, categoryTypeId, createItem, updateItem, handleClose],
  );

  return {
    form,
    categoryTypeData,
    isCreate,
    onSubmit: handleSubmit,
    isFetching: isLoading,
    isPending: isCreating || isUpdating,
  };
}
