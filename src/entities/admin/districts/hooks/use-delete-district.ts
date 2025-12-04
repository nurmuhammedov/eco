import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { districtAPI, districtKeys, DistrictResponse } from '@/entities/admin/districts'

export const useDeleteDistrict = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: districtAPI.deleteDistrict,

    onMutate: async (districtId: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: districtKeys.list('district'),
      })
      await queryClient.cancelQueries({
        queryKey: districtKeys.detail('district', districtId),
      })

      // Capture current state for rollback
      const previousDistrictsList = queryClient.getQueryData<ResponseData<DistrictResponse>>(
        districtKeys.list('district')
      )
      const previousDistrictDetail = queryClient.getQueryData<DistrictResponse>(
        districtKeys.detail('district', districtId)
      )

      // Optimistically remove from lists
      if (previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), {
          ...previousDistrictsList,
          content: previousDistrictsList.content.filter((district) => district.id !== districtId),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: districtKeys.detail('district', districtId),
      })

      return { previousDistrictsList, previousDistrictDetail }
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: districtKeys.list('district'),
      })
    },

    onError: (_err, districtId, context) => {
      // Restore detail cache if it existed
      if (context?.previousDistrictDetail) {
        queryClient.setQueryData(districtKeys.detail('district', districtId), context.previousDistrictDetail)
      }

      // Restore list cache
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), context.previousDistrictsList)
      }
    },
  })
}
