import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { equipmentAPI } from '../model/equipment.api'
import { equipmentKeys } from '../model/equipment.query-keys'
import { EquipmentResponse } from '../model/equipment.types'

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: equipmentAPI.delete,

    onMutate: async (id: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.list('equipment'),
      })
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.detail('equipment', id),
      })

      // Capture current state for rollback
      const previousDistrictsList = queryClient.getQueryData<ResponseData<EquipmentResponse>>(
        equipmentKeys.list('equipment')
      )
      const previousDetail = queryClient.getQueryData<EquipmentResponse>(equipmentKeys.detail('equipment', id))

      // Optimistically remove from lists
      if (previousDistrictsList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), {
          ...previousDistrictsList,
          content: previousDistrictsList.content.filter((equipment) => equipment.id !== id),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: equipmentKeys.detail('equipment', id),
      })

      return { previousDistrictsList, previousDetail }
    },

    onSuccess: () => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: equipmentKeys.root() })
      invalidateEndpoint(queryClient, API_ENDPOINTS.CHILD_EQUIPMENTS)
    },

    onError: (_err, id, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(equipmentKeys.detail('equipment', id), context.previousDetail)
      }

      // Restore list cache
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), context.previousDistrictsList)
      }
    },
  })
}
