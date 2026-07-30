import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  hazardousFacilityCategoryAPI,
  hazardousFacilityCategoryKeys,
  HazardousFacilityCategoryResponse,
} from '@/entities/admin/hazardous-facility-category'

export const useDeleteHazardousFacilityCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: hazardousFacilityCategoryAPI.delete,

    onMutate: async (id: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
      })
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityCategoryKeys.detail('hazardous-facility-category', id),
      })

      // Capture current state for rollback
      const previousListData = queryClient.getQueryData<ResponseData<HazardousFacilityCategoryResponse>>(
        hazardousFacilityCategoryKeys.list('hazardous-facility-category')
      )
      const previousDetail = queryClient.getQueryData<HazardousFacilityCategoryResponse>(
        hazardousFacilityCategoryKeys.detail('hazardous-facility-category', id)
      )

      // Optimistically remove from lists
      if (previousListData) {
        queryClient.setQueryData(hazardousFacilityCategoryKeys.list('hazardous-facility-category'), {
          ...previousListData,
          content: previousListData.content.filter((district) => district.id !== id),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: hazardousFacilityCategoryKeys.detail('hazardous-facility-category', id),
      })

      return { previousListData, previousDetail }
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
      })
    },

    onError: (_err, regionId, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(
          hazardousFacilityCategoryKeys.detail('hazardous-facility-category', regionId),
          context.previousDetail
        )
      }

      // Restore list cache
      if (context?.previousListData) {
        queryClient.setQueryData(
          hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
          context.previousListData
        )
      }
    },
  })
}
