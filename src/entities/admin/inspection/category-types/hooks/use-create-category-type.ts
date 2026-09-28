import { inspectionCategoryTypeAPI } from '../model/category-type.api'
import { categoryTypeKeys } from '../model/category-type.query-keys'
import { useSliceMutation } from '@/shared/lib/query/use-slice-mutation'

export const useCreateCategoryType = () =>
  useSliceMutation(inspectionCategoryTypeAPI.createCategoryType, categoryTypeKeys.root())
