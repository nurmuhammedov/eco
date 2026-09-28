import { inspectionCategoryTypeAPI as categoryTypeAPI } from '../model/category-type.api'
import { categoryTypeKeys } from '../model/category-type.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useUpdateCategoryType = () => useSliceMutation(categoryTypeAPI.updateCategoryType, categoryTypeKeys.root())
