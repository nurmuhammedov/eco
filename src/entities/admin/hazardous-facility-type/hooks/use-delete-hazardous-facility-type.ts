import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hazardousFacilityTypeAPI } from '../models/hazardous-facility-type.api'
import { hazardousFacilityTypeKeys } from '../models/hazardous-facility-type.query-keys'
import { HazardousFacilityTypeResponse } from '../models/hazardous-facility-type.types'

export const useDeleteHazardousFacilityType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: hazardousFacilityTypeAPI.delete,

    onMutate: async (id: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityTypeKeys.list('hazardous-facility-type'),
      })
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityTypeKeys.detail('hazardous-facility-type', id),
      })

      // Capture current state for rollback
      const previousListData = queryClient.getQueryData<ResponseData<HazardousFacilityTypeResponse>>(
        hazardousFacilityTypeKeys.list('hazardous-facility-type')
      )
      const previousDetail = queryClient.getQueryData<HazardousFacilityTypeResponse>(
        hazardousFacilityTypeKeys.detail('hazardous-facility-type', id)
      )

      // Optimistically remove from lists
      if (previousListData) {
        queryClient.setQueryData(hazardousFacilityTypeKeys.list('hazardous-facility-type'), {
          ...previousListData,
          content: previousListData.content.filter((district) => district.id !== id),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: hazardousFacilityTypeKeys.detail('hazardous-facility-type', id),
      })

      return { previousListData, previousDetail }
    },

    onSuccess: () => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: hazardousFacilityTypeKeys.root() })
    },

    onError: (_err, regionId, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(
          hazardousFacilityTypeKeys.detail('hazardous-facility-type', regionId),
          context.previousDetail
        )
      }

      // Restore list cache
      if (context?.previousListData) {
        queryClient.setQueryData(hazardousFacilityTypeKeys.list('hazardous-facility-type'), context.previousListData)
      }
    },
  })
}
