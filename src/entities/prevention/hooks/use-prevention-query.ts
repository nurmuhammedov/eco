import { preventionAPI } from '@/entities/prevention';
import { useQuery } from '@tanstack/react-query';

export const usePreventions = (params: any) => {
  return useQuery({
    queryKey: ['preventions', params],
    queryFn: () => preventionAPI.getAll(params),
  });
};

export const usePreventionDetail = (id: string) => {
  return useQuery({
    queryKey: ['/preventions', id],
    queryFn: () => preventionAPI.getById(id),
    enabled: !!id,
  });
};

export const usePreventionTypes = () => {
  return useQuery({
    queryKey: ['prevention-types'],
    queryFn: () => preventionAPI.getTypes(),
  });
};

export const usePreventionFile = (year: number) => {
  return useQuery({
    queryKey: ['prevention-file', year],
    queryFn: () => preventionAPI.getPreventionFile(year),
    enabled: !!year,
    retry: 1,
  });
};
