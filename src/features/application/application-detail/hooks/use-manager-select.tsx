import { useQuery } from '@tanstack/react-query';
import { applicationDetailApi } from '../model/application-detail.api.ts';

export const useManagerSelect = () => {
  return useQuery({
    queryKey: ['manager select'],
    queryFn: () => applicationDetailApi.getManagerListSelect(),
  });
};
