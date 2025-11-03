// src/entities/admin/checklist-templates/model/use-checklist-templates-query.ts
import {
  checklistTemplateAPI,
  checklistTemplateKeys,
  FilterChecklistTemplateDTO,
} from '@/entities/admin/checklist-templates';
import { useQuery } from '@tanstack/react-query';

export const useChecklistTemplateList = (filters?: FilterChecklistTemplateDTO) => {
  return useQuery({
    queryKey: checklistTemplateKeys.list('checklist-templates', filters),
    queryFn: () => checklistTemplateAPI.getAll(filters),
  });
};

export const useChecklistTemplateDetail = (id?: number) => {
  return useQuery({
    queryKey: checklistTemplateKeys.detail('checklist-templates', id!),
    queryFn: () => checklistTemplateAPI.getById(id!),
    enabled: !!id,
  });
};
