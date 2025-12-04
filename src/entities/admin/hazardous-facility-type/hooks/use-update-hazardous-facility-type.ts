import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  hazardousFacilityTypeAPI,
  hazardousFacilityTypeKeys,
  UpdateHazardousFacilityTypeDTO,
} from '@/entities/admin/hazardous-facility-type'

export const useUpdateHazardousFacilityType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: hazardousFacilityTypeAPI.update,

    onMutate: async (updatingData: UpdateHazardousFacilityTypeDTO) => {
      // Ensure we have a valid ID
      if (!updatingData.id) {
        throw new Error('Cannot update updatingData without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityTypeKeys.detail('hazardous-facility-type', updatingData.id),
      })
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityTypeKeys.list('hazardous-facility-type'),
      })

      // Capture current states for rollback
      const previousRegionDetail = queryClient.getQueryData<UpdateHazardousFacilityTypeDTO>(
        hazardousFacilityTypeKeys.detail('hazardous-facility-type', updatingData.id)
      )

      const previousListData = queryClient.getQueryData<ResponseData<UpdateHazardousFacilityTypeDTO>>(
        hazardousFacilityTypeKeys.list('hazardous-facility-type')
      )

      // Update hazardous-facility-type detail
      queryClient.setQueryData(
        hazardousFacilityTypeKeys.detail('hazardous-facility-type', updatingData.id),
        updatingData
      )

      // Update hazardous-facility-type in lists
      if (previousListData) {
        queryClient.setQueryData(hazardousFacilityTypeKeys.list('hazardous-facility-type'), {
          ...previousListData,
          content: previousListData.content.map((item) => (item.id === updatingData.id ? updatingData : item)),
        })
      }

      return { previousRegionDetail, previousListData }
    },

    onSuccess: (updatedData) => {
      // Set the updated hazardous-facility-type in cache
      if (updatedData.data.id) {
        queryClient.setQueryData(
          hazardousFacilityTypeKeys.detail('hazardous-facility-type', updatedData.data.id),
          updatedData
        )
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: hazardousFacilityTypeKeys.list('hazardous-facility-type'),
      })
    },

    onError: (_err, updatedData, context) => {
      // Revert hazardous-facility-type detail on error
      if (context?.previousRegionDetail) {
        queryClient.setQueryData(
          hazardousFacilityTypeKeys.detail('hazardous-facility-type', updatedData.id),
          context.previousRegionDetail
        )
      }

      // Revert hazardous-facility-type in lists
      if (context?.previousListData) {
        queryClient.setQueryData(hazardousFacilityTypeKeys.list('hazardous-facility-type'), context.previousListData)
      }
    },
  })
}
