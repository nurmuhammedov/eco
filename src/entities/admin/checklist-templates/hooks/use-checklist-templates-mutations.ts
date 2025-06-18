// src/entities/admin/checklist-templates/hooks/use-checklist-templates-mutations.ts
import {
  checklistTemplateAPI,
  checklistTemplateKeys,
  CreateChecklistTemplateDTO,
  UpdateChecklistTemplateDTO,
} from '@/entities/admin/checklist-templates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateChecklistTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChecklistTemplateDTO) => checklistTemplateAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistTemplateKeys.list('checklist-templates') });
      toast.success("Cheklist muvaffaqiyatli qo'shildi");
    },
    onError: (error) => toast.error(`Xatolik: ${error.message}`),
  });
};

export const useUpdateChecklistTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateChecklistTemplateDTO) =>
      checklistTemplateAPI.update({ active: data?.active, id: data?.id } as unknown as UpdateChecklistTemplateDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistTemplateKeys.list('checklist-templates') });
      toast.success('Cheklist muvaffaqiyatli yangilandi');
    },
    onError: (error) => toast.error(`Xatolik: ${error.message}`),
  });
};

export const useDeleteChecklistTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => checklistTemplateAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: checklistTemplateKeys.list('checklist-templates') });
      toast.success("Cheklist o'chirildi");
    },
    onError: (error) => toast.error(`Xatolik: ${error.message}`),
  });
};
