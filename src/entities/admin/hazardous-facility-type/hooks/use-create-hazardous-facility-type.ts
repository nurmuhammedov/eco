import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { CreateHazardousFacilityTypeDTO, HazardousFacilityTypeResponse } from '../model/hazardous-facility-type.types'
import { hazardousFacilityTypeAPI } from '../model/hazardous-facility-type.api'
import { hazardousFacilityTypeKeys } from '../model/hazardous-facility-type.query-keys'
import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateHazardousFacilityType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: hazardousFacilityTypeAPI.create,

    onMutate: async (newRegionData: CreateHazardousFacilityTypeDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityTypeKeys.list('hazardous-facility-type'),
      })

      // Capture current state for rollback
      const previousListData = queryClient.getQueryData<ResponseData<HazardousFacilityTypeResponse>>(
        hazardousFacilityTypeKeys.list('hazardous-facility-type')
      )

      if (previousListData) {
        // Create a temporary hazardous-facility-type with fake ID
        const temporaryRegion: CreateHazardousFacilityTypeDTO & { id: number } = {
          ...newRegionData,
          id: -Date.now(), // Temporary negative ID to identify new items
        }

        // Add to the list
        queryClient.setQueryData(hazardousFacilityTypeKeys.list('hazardous-facility-type'), {
          ...previousListData,
          content: [...previousListData.content, temporaryRegion],
        })
      }

      return { previousListData }
    },

    onSuccess: (createdData) => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: hazardousFacilityTypeKeys.root() })
      invalidateEndpoint(queryClient, API_ENDPOINTS.HAZARDOUS_FACILITY_TYPES)

      // Add the newly created hazardous-facility-type to cache
      queryClient.setQueryData(
        hazardousFacilityTypeKeys.detail('hazardous-facility-type', createdData.data.id!),
        createdData
      )
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousListData) {
        queryClient.setQueryData(hazardousFacilityTypeKeys.list('hazardous-facility-type'), context.previousListData)
      }
    },
  })
}
