import {
  CreateHazardousFacilityCategoryDTO,
  HazardousFacilityCategoryResponse,
} from '../models/hazardous-facility-category.types'
import { hazardousFacilityCategoryAPI } from '../models/hazardous-facility-category.api'
import { hazardousFacilityCategoryKeys } from '../models/hazardous-facility-category.query-keys'
import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateHazardousFacilityCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: hazardousFacilityCategoryAPI.create,

    onMutate: async (newRegionData: CreateHazardousFacilityCategoryDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
      })

      // Capture current state for rollback
      const previousListData = queryClient.getQueryData<ResponseData<HazardousFacilityCategoryResponse>>(
        hazardousFacilityCategoryKeys.list('hazardous-facility-category')
      )

      if (previousListData) {
        // Create a temporary hazardous-facility-category with fake ID
        const temporaryRegion: CreateHazardousFacilityCategoryDTO & { id: number } = {
          ...newRegionData,
          id: -Date.now(), // Temporary negative ID to identify new items
        }

        // Add to the list
        queryClient.setQueryData(hazardousFacilityCategoryKeys.list('hazardous-facility-category'), {
          ...previousListData,
          content: [...previousListData.content, temporaryRegion],
        })
      }

      return { previousListData }
    },

    onSuccess: (createdData) => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: hazardousFacilityCategoryKeys.root() })

      // Add the newly created hazardous-facility-category to cache
      queryClient.setQueryData(
        hazardousFacilityCategoryKeys.detail('hazardous-facility-category', createdData.data.id!),
        createdData
      )
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousListData) {
        queryClient.setQueryData(
          hazardousFacilityCategoryKeys.list('hazardous-facility-category'),
          context.previousListData
        )
      }
    },
  })
}
