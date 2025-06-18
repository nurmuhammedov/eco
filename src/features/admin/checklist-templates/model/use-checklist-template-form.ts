// src/features/admin/checklist-templates/model/use-checklist-template-form.ts
import {
  CreateChecklistTemplateDTO,
  schemas,
  UpdateChecklistTemplateDTO,
  useCreateChecklistTemplate,
  useUpdateChecklistTemplate,
} from '@/entities/admin/checklist-templates';
import { useDetail } from '@/shared/hooks';
import { useChecklistTemplateDrawer } from '@/shared/hooks/entity-hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function useChecklistTemplateForm() {
  const { data, onClose, isCreate } = useChecklistTemplateDrawer();

  const form = useForm<CreateChecklistTemplateDTO>({
    resolver: zodResolver(schemas.create),
    defaultValues: { name: '', path: '', active: true },
  });

  const { mutateAsync: createMutation, isPending: isCreating } = useCreateChecklistTemplate();
  const { mutateAsync: updateMutation, isPending: isUpdating } = useUpdateChecklistTemplate();

  const { data: detailData, isLoading: isFetchingDetail } = useDetail<{
    name: string;
    path: string;
    active: boolean;
  }>('/checklist-templates', data?.id);

  useEffect(() => {
    if (detailData && !isCreate) {
      form.reset({ name: detailData?.name, path: detailData?.path, active: detailData?.active });
    }
  }, [detailData, isCreate, form]);

  const handleSubmit = async (formData: CreateChecklistTemplateDTO) => {
    const response = isCreate
      ? await createMutation(formData)
      : await updateMutation({ id: data!.id, ...formData } as UpdateChecklistTemplateDTO);

    if (response?.success) {
      onClose();
      form.reset();
    }
  };

  return {
    form,
    isCreate,
    onSubmit: form.handleSubmit(handleSubmit),
    isPending: isCreating || isUpdating,
    isFetching: isFetchingDetail,
  };
}
