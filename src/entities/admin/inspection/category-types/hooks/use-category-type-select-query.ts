import { useQuery } from '@tanstack/react-query'
import { inspectionCategoryTypeAPI as categoryTypeAPI } from '../model/category-type.api'
import { categoryTypeKeys } from '../model/category-type.query-keys'

export const useCategoryTypeSelectQuery = (category?: string, enabled: boolean = true) => {
  return useQuery({
    staleTime: 0,
    queryFn: () => categoryTypeAPI.fetchCategoryTypeSelect({ type: category }),
    queryKey: [...categoryTypeKeys.entity('category-type-select'), category],
    enabled,
  })
}
