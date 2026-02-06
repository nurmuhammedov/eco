// src/entities/admin/checklist-templates/model/use-checklist-templates-mutations.ts
import {
  checklistTemplateAPI,
  checklistTemplateKeys,
  CreateChecklistTemplateDTO,
  UpdateChecklistTemplateDTO,
} from '@/entities/admin/checklist-templates'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateChecklistTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateChecklistTemplateDTO) => checklistTemplateAPI.create(data),
    onSuccess: async () => {
      toast.success('Cheklist muvaffaqiyatli qo‘shildi')
      await queryClient.invalidateQueries({ queryKey: checklistTemplateKeys.list('checklist-templates') })
    },
    // onError: (error) => toast.error(`Xatolik: ${error.message}`),
  })
}

export const useUpdateChecklistTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateChecklistTemplateDTO) =>
      checklistTemplateAPI.update({ active: data?.active, id: data?.id } as unknown as UpdateChecklistTemplateDTO),
    onSuccess: async () => {
      toast.success('Cheklist muvaffaqiyatli yangilandi')
      await queryClient.invalidateQueries({ queryKey: checklistTemplateKeys.list('checklist-templates') })
    },
    // onError: (error) => toast.error(`Xatolik: ${error.message}`),
  })
}

export const useDeleteChecklistTemplate = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => checklistTemplateAPI.delete(id),
    onSuccess: async () => {
      toast.success('Cheklist o‘chirildi')
      await queryClient.invalidateQueries({ queryKey: checklistTemplateKeys.list('checklist-templates') })
    },
    // onError: (error) => toast.error(`Xatolik: ${error.message}`),
  })
}
