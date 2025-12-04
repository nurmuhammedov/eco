import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  territorialStaffAPI,
  territorialStaffKeys,
  UpdateTerritorialStaffDTO,
} from '@/entities/admin/territorial-staffs'

export const useUpdateTerritorialStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: territorialStaffAPI.update,

    onMutate: async (updateData: UpdateTerritorialStaffDTO) => {
      // Ensure we have a valid ID
      if (!updateData.id) {
        throw new Error('Cannot update territorial-staff without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialStaffKeys.detail('territorial-staff', updateData.id),
      })
      await queryClient.cancelQueries({
        queryKey: territorialStaffKeys.list('territorial-staff'),
      })

      // Capture current states for rollback
      const previousDetail = queryClient.getQueryData<UpdateTerritorialStaffDTO>(
        territorialStaffKeys.detail('territorial-staff', updateData.id)
      )

      const previousList = queryClient.getQueryData<ResponseData<UpdateTerritorialStaffDTO>>(
        territorialStaffKeys.list('territorial-staff')
      )

      // Update territorial-staff detail
      queryClient.setQueryData(territorialStaffKeys.detail('territorial-staff', updateData.id), updateData)

      // Update territorial-staff in lists
      if (previousList) {
        queryClient.setQueryData(territorialStaffKeys.list('territorial-staff'), {
          ...previousList,
          content: previousList.content.map((district) => (district.id === updateData.id ? updateData : district)),
        })
      }

      return { previousDetail, previousList }
    },

    onSuccess: (updatedData) => {
      // Set the updated territorial-staff in cache
      if (updatedData.data.id) {
        queryClient.setQueryData(territorialStaffKeys.detail('territorial-staff', updatedData.data.id), updatedData)
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: territorialStaffKeys.list('territorial-staff'),
      })
    },

    onError: (_err, updatedData, context) => {
      // Revert territorial-staff detail on error
      if (context?.previousDetail) {
        queryClient.setQueryData(
          territorialStaffKeys.detail('territorial-staff', updatedData.id),
          context.previousDetail
        )
      }

      // Revert territorial-staff in lists
      if (context?.previousList) {
        queryClient.setQueryData(territorialStaffKeys.list('territorial-staff'), context.previousList)
      }
    },
  })
}
