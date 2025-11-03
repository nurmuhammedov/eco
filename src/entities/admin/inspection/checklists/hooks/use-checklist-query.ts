import { getTime } from '@/shared/lib/get-time';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { inspectionChecklistAPI as checklistAPI, checklistKeys } from '@/entities/admin/inspection';
import { ChecklistResponse, FilterChecklistDTO } from '../models/checklist.types';

export const useChecklistsQuery = (filters: FilterChecklistDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: checklistKeys.list('checklist', filters),
    queryFn: () => checklistAPI.fetchChecklists(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useChecklistQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<ChecklistResponse, Error, ChecklistResponse, ReturnType<typeof checklistKeys.detail>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => checklistAPI.fetchChecklist(id),
    queryKey: checklistKeys.detail('checklist', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};
