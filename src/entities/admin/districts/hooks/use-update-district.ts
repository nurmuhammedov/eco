import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { districtAPI, districtKeys, UpdateDistrictDTO } from '@/entities/admin/districts'

export const useUpdateDistrict = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: districtAPI.updateDistrict,

    onMutate: async (districtUpdate: UpdateDistrictDTO) => {
      // Ensure we have a valid ID
      if (!districtUpdate.id) {
        throw new Error('Cannot update district without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: districtKeys.detail('district', districtUpdate.id),
      })
      await queryClient.cancelQueries({
        queryKey: districtKeys.list('district'),
      })

      // Capture current states for rollback
      const previousRegionDetail = queryClient.getQueryData<UpdateDistrictDTO>(
        districtKeys.detail('district', districtUpdate.id)
      )

      const previousDistrictsList = queryClient.getQueryData<ResponseData<UpdateDistrictDTO>>(
        districtKeys.list('district')
      )

      // Update district detail
      queryClient.setQueryData(districtKeys.detail('district', districtUpdate.id), districtUpdate)

      // Update district in lists
      if (previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), {
          ...previousDistrictsList,
          content: previousDistrictsList.content.map((district) =>
            district.id === districtUpdate.id ? districtUpdate : district
          ),
        })
      }

      return { previousRegionDetail, previousDistrictsList }
    },

    onSuccess: (updatedDistrict) => {
      // Set the updated district in cache
      if (updatedDistrict.data.id) {
        queryClient.setQueryData(districtKeys.detail('district', updatedDistrict.data.id), updatedDistrict)
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: districtKeys.list('district'),
      })
    },

    onError: (_err, updatedDistrict, context) => {
      // Revert district detail on error
      if (context?.previousRegionDetail) {
        queryClient.setQueryData(districtKeys.detail('district', updatedDistrict.id), context.previousRegionDetail)
      }

      // Revert district in lists
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), context.previousDistrictsList)
      }
    },
  })
}
