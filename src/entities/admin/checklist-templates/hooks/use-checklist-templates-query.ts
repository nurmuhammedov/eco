import { checklistTemplateAPI } from '../models/checklist-templates.api'
import { checklistTemplateKeys } from '../models/checklist-templates.query-keys'
import { FilterChecklistTemplateDTO } from '../models/checklist-templates.types'
import { useQuery } from '@tanstack/react-query'

export const useChecklistTemplateList = (filters?: FilterChecklistTemplateDTO) => {
  return useQuery({
    queryKey: checklistTemplateKeys.list('checklist-templates', filters),
    queryFn: () => checklistTemplateAPI.getAll(filters),
  })
}

export const useChecklistTemplateDetail = (id?: number) => {
  return useQuery({
    queryKey: checklistTemplateKeys.detail('checklist-templates', id!),
    queryFn: () => checklistTemplateAPI.getById(id!),
    enabled: !!id,
  })
}
