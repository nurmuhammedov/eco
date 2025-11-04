import { getTime } from '@/shared/lib/get-time';
import { useQuery } from '@tanstack/react-query';
import { inspectionCategoryTypeAPI as categoryTypeAPI, categoryTypeKeys } from '@/entities/admin/inspection';

export const useCategoryTypeSelectQuery = (category: string) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryFn: () => categoryTypeAPI.fetchCategoryTypeSelect({ category }),
    queryKey: [...categoryTypeKeys.entity('category-type-select'), category],
    enabled: !!category,
  });
};
