import { useQuery } from '@tanstack/react-query';
import { applicationDetailApi } from '../model/application-detail.api.ts';

export const useInspectorSelect = () => {
  return useQuery({
    queryKey: ['inspector select'],
    queryFn: () => applicationDetailApi.getInspectorListSelect(),
  });
};
