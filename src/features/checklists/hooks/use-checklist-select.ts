import { apiClient } from '@/shared/api';
import { useQuery } from '@tanstack/react-query';

const getChecklistSelect = async () => {
  const { data } = await apiClient.get<any>(`/checklist-templates/select`);
  return data.data;
};
export const useCheckListSelect = () => {
  return useQuery({
    queryKey: ['CHECKLIST-SELECT'],
    staleTime: 0,
    queryFn: getChecklistSelect,
  });
};
