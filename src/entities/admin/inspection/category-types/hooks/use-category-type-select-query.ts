import { useQuery } from '@tanstack/react-query';
import { inspectionCategoryTypeAPI as categoryTypeAPI, categoryTypeKeys } from '@/entities/admin/inspection';

export const useCategoryTypeSelectQuery = (category?: string) => {
  return useQuery({
    staleTime: 0,
    queryFn: () => categoryTypeAPI.fetchCategoryTypeSelect({ type: category }),
    queryKey: [...categoryTypeKeys.entity('category-type-select'), category],
  });
};
