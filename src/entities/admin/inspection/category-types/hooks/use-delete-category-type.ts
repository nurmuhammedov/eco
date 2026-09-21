import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inspectionCategoryTypeAPI as categoryTypeAPI } from '../models/category-type.api'
import { categoryTypeKeys } from '../models/category-type.query-keys'
import { CategoryTypeResponse } from '../models/category-type.types'

export const useDeleteCategoryType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryTypeAPI.deleteCategoryType,

    onMutate: async (categoryTypeId: number) => {
      await queryClient.cancelQueries({ queryKey: categoryTypeKeys.list('category-type') })
      await queryClient.cancelQueries({ queryKey: categoryTypeKeys.detail('category-type', categoryTypeId) })

      const previousCategoryTypeList = queryClient.getQueryData<ResponseData<CategoryTypeResponse>>(
        categoryTypeKeys.list('category-type')
      )
      const previousCategoryTypeDetail = queryClient.getQueryData<CategoryTypeResponse>(
        categoryTypeKeys.detail('category-type', categoryTypeId)
      )

      if (previousCategoryTypeList) {
        queryClient.setQueryData(categoryTypeKeys.list('category-type'), {
          ...previousCategoryTypeList,
          content: previousCategoryTypeList.content.filter((type) => type.id !== categoryTypeId),
        })
      }

      queryClient.removeQueries({
        queryKey: categoryTypeKeys.detail('category-type', categoryTypeId),
      })

      return { previousCategoryTypeList, previousCategoryTypeDetail }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryTypeKeys.root() })
    },

    onError: (_err, categoryTypeId, context) => {
      if (context?.previousCategoryTypeDetail) {
        queryClient.setQueryData(
          categoryTypeKeys.detail('category-type', categoryTypeId),
          context.previousCategoryTypeDetail
        )
      }

      if (context?.previousCategoryTypeList) {
        queryClient.setQueryData(categoryTypeKeys.list('category-type'), context.previousCategoryTypeList)
      }
    },
  })
}
