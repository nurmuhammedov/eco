import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { equipmentAPI, equipmentKeys, UpdateEquipmentDTO } from '@/entities/admin/equipment'

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: equipmentAPI.update,

    onMutate: async (updateData: UpdateEquipmentDTO) => {
      // Ensure we have a valid ID
      if (!updateData.id) {
        throw new Error('Cannot update data without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.detail('equipment', updateData.id),
      })
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.list('equipment'),
      })

      // Capture current states for rollback
      const previousRegionDetail = queryClient.getQueryData<UpdateEquipmentDTO>(
        equipmentKeys.detail('equipment', updateData.id)
      )

      const previousList = queryClient.getQueryData<ResponseData<UpdateEquipmentDTO>>(equipmentKeys.list('equipment'))

      // Update equipment detail
      queryClient.setQueryData(equipmentKeys.detail('equipment', updateData.id), updateData)

      // Update equipment in lists
      if (previousList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), {
          ...previousList,
          content: previousList.content.map((equipment) => (equipment.id === updateData.id ? updateData : equipment)),
        })
      }

      return { previousRegionDetail, previousList }
    },

    onSuccess: (updatedDistrict) => {
      // Set the updated equipment in cache
      if (updatedDistrict.data.id) {
        queryClient.setQueryData(equipmentKeys.detail('equipment', updatedDistrict.data.id), updatedDistrict)
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.list('equipment'),
      })
    },

    onError: (_err, updatedDistrict, context) => {
      // Revert equipment detail on error
      if (context?.previousRegionDetail) {
        queryClient.setQueryData(equipmentKeys.detail('equipment', updatedDistrict.id), context.previousRegionDetail)
      }

      // Revert equipment in lists
      if (context?.previousList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), context.previousList)
      }
    },
  })
}
