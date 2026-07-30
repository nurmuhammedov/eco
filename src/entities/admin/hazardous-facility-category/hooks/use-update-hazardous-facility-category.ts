import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  hazardousFacilityCategoryAPI,
  hazardousFacilityCategoryKeys,
  UpdateHazardousFacilityCategoryDTO,
} from '@/entities/admin/hazardous-facility-category'

export const useUpdateHazardousFacilityCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: hazardousFacilityCategoryAPI.update,

    onMutate: async (updatingData: UpdateHazardousFacilityCategoryDTO) => {
      // Ensure we have a valid ID
      if (!updatingData.id) {
        throw new Error('Cannot update updatingData without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityCategoryKeys.detail('hazardous-facility-category', updatingData.id),
      })
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
      })

      // Capture current states for rollback
      const previousRegionDetail = queryClient.getQueryData<UpdateHazardousFacilityCategoryDTO>(
        hazardousFacilityCategoryKeys.detail('hazardous-facility-category', updatingData.id)
      )

      const previousListData = queryClient.getQueryData<ResponseData<UpdateHazardousFacilityCategoryDTO>>(
        hazardousFacilityCategoryKeys.list('hazardous-facility-category')
      )

      // Update hazardous-facility-category detail
      queryClient.setQueryData(
        hazardousFacilityCategoryKeys.detail('hazardous-facility-category', updatingData.id),
        updatingData
      )

      // Update hazardous-facility-category in lists
      if (previousListData) {
        queryClient.setQueryData(hazardousFacilityCategoryKeys.list('hazardous-facility-category'), {
          ...previousListData,
          content: previousListData.content.map((item) => (item.id === updatingData.id ? updatingData : item)),
        })
      }

      return { previousRegionDetail, previousListData }
    },

    onSuccess: (updatedData) => {
      // Set the updated hazardous-facility-category in cache
      if (updatedData.data.id) {
        queryClient.setQueryData(
          hazardousFacilityCategoryKeys.detail('hazardous-facility-category', updatedData.data.id),
          updatedData
        )
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
      })
    },

    onError: (_err, updatedData, context) => {
      // Revert hazardous-facility-category detail on error
      if (context?.previousRegionDetail) {
        queryClient.setQueryData(
          hazardousFacilityCategoryKeys.detail('hazardous-facility-category', updatedData.id),
          context.previousRegionDetail
        )
      }

      // Revert hazardous-facility-category in lists
      if (context?.previousListData) {
        queryClient.setQueryData(
          hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
          context.previousListData
        )
      }
    },
  })
}
