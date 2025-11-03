import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo } from 'react';
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks';
import {
  CreateChecklistDTO,
  checklistSchema,
  UpdateChecklistDTO,
  useCreateChecklist,
  useChecklistQuery,
  useCategoryTypeSelectQuery,
  useUpdateChecklist,
} from '@/entities/admin/inspection';

const DEFAULT_VALUES: CreateChecklistDTO = {
  categoryTypeId: '',
  orderNumber: '',
  question: '',
  negative: '',
  corrective: '',
};

export function useChecklistForm() {
  const { data, onClose, isCreate } = useChecklistDrawer();
  const checklistId = useMemo(() => (data?.id ? data.id : 0), [data]);

  const form = useForm<CreateChecklistDTO>({
    resolver: zodResolver(checklistSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { data: categoryTypes } = useCategoryTypeSelectQuery();
  const { mutateAsync: createItem, isPending: isCreating } = useCreateChecklist();
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateChecklist();
  const { data: checklistData, isLoading } = useChecklistQuery(checklistId);

  useEffect(() => {
    if (checklistData && !isCreate) {
      form.reset({
        ...checklistData,
        categoryTypeId: checklistData.categoryTypeId?.toString(),
        orderNumber: checklistData.orderNumber?.toString(),
      });
    }
  }, [checklistData, isCreate, form]);

  const handleClose = useCallback(() => {
    onClose();
    form.reset(DEFAULT_VALUES);
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (formData: CreateChecklistDTO): Promise<boolean> => {
      try {
        const response = isCreate
          ? await createItem(formData)
          : await updateItem({ id: checklistId, ...formData } as UpdateChecklistDTO);

        if (response.success) {
          handleClose();
          return true;
        }
        return false;
      } catch (error) {
        console.error('[useChecklistForm] Submission error:', error);
        return false;
      }
    },
    [isCreate, checklistId, createItem, updateItem, handleClose],
  );

  return {
    form,
    isCreate,
    categoryTypes,
    onSubmit: handleSubmit,
    isFetching: isLoading,
    isPending: isCreating || isUpdating,
  };
}
