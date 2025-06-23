import { ISearchParams } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { inspectionAPI } from '../api/inspection.api';

const INSPECTION_QUERY_KEY = 'inspections';

export const useInspections = (params: ISearchParams) => {
  return useQuery({
    queryKey: [INSPECTION_QUERY_KEY, params],
    queryFn: () => inspectionAPI.getAll(params),
    enabled: !!params.intervalId,
  });
};

export const useInspectionById = (id: string) => {
  return useQuery({
    queryKey: [INSPECTION_QUERY_KEY, id],
    queryFn: () => inspectionAPI.getById(id),
    enabled: !!id,
  });
};
