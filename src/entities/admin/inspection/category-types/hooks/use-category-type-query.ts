import { getTime } from '@/shared/lib/get-time';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { inspectionCategoryTypeAPI as categoryTypeAPI, categoryTypeKeys } from '@/entities/admin/inspection';
import { CategoryTypeResponse, FilterCategoryTypeDTO } from '@/entities/admin/inspection';

export const useCategoryTypesQuery = (filters: FilterCategoryTypeDTO) => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryKey: categoryTypeKeys.list('category-type', filters),
    queryFn: () => categoryTypeAPI.fetchCategoryTypes(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useCategoryTypeQuery = (
  id: number,
  options?: Omit<
    UseQueryOptions<CategoryTypeResponse, Error, CategoryTypeResponse, ReturnType<typeof categoryTypeKeys.detail>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    enabled: !!id,
    staleTime: getTime(1, 'day'),
    queryFn: () => categoryTypeAPI.fetchCategoryType(id),
    queryKey: categoryTypeKeys.detail('category-type', id),
    placeholderData: (previousData) => previousData,
    ...options,
  });
};

export const useCategoryTypesSelectQuery = () => {
  return useQuery({
    staleTime: getTime(1, 'week'),
    queryFn: () => categoryTypeAPI.fetchCategoryTypeMetaSelect(),
    queryKey: ['meta-category-types-select'],
  });
};
