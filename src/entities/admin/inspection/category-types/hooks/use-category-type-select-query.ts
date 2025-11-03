import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { inspectionCategoryTypeAPI as categoryTypeAPI, categoryTypeKeys } from '@/entities/admin/inspection';

export const useCategoryTypeSelectQuery = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryFn: () => categoryTypeAPI.fetchCategoryTypeSelect(),
    queryKey: categoryTypeKeys.entity('category-type-select'),
  });
};
