import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateCategoryTypeDTO, CategoryTypeResponse } from '../models/category-type.types'
import { inspectionCategoryTypeAPI } from '../models/category-type.api'
import { categoryTypeKeys } from '../models/category-type.query-keys'

export const useCreateCategoryType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inspectionCategoryTypeAPI.createCategoryType,

    onMutate: async (newCategoryTypeData: CreateCategoryTypeDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: categoryTypeKeys.list('category-type'),
      })

      // Capture current state for rollback
      const previousCategoryTypesList = queryClient.getQueryData<ResponseData<CategoryTypeResponse>>(
        categoryTypeKeys.list('category-type')
      )

      if (previousCategoryTypesList) {
        // Create a temporary record with fake ID
        const temporaryCategoryType: CreateCategoryTypeDTO & { id: number } = {
          ...newCategoryTypeData,
          id: -Date.now(), // Temporary negative ID
        }

        // Add to the list
        queryClient.setQueryData(categoryTypeKeys.list('category-type'), {
          ...previousCategoryTypesList,
          content: [...previousCategoryTypesList.content, temporaryCategoryType],
        })
      }

      return { previousCategoryTypesList }
    },

    onSuccess: (createdCategoryType) => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: categoryTypeKeys.root() })

      // Add the newly created item to cache
      queryClient.setQueryData(
        categoryTypeKeys.detail('category-type', createdCategoryType.data.id!),
        createdCategoryType
      )
    },

    onError: (_err, _newCategoryType, context) => {
      // Revert optimistic updates on error
      if (context?.previousCategoryTypesList) {
        queryClient.setQueryData(categoryTypeKeys.list('category-type'), context.previousCategoryTypesList)
      }
    },
  })
}
