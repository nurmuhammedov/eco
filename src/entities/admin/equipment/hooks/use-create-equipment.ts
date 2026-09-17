import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateEquipmentDTO, EquipmentResponse } from '../models/equipment.types'
import { equipmentAPI } from '../models/equipment.api'
import { equipmentKeys } from '../models/equipment.query-keys'

export const useCreateEquipment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: equipmentAPI.create,

    onMutate: async (newData: CreateEquipmentDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.list('equipment'),
      })

      // Capture current state for rollback
      const previousDataList = queryClient.getQueryData<ResponseData<EquipmentResponse>>(
        equipmentKeys.list('equipment')
      )

      if (previousDataList) {
        // Create a temporary equipment with fake ID
        const temporaryRegion: CreateEquipmentDTO & { id: number } = {
          ...newData,
          id: -Date.now(), // Temporary negative ID to identify new items
        }

        // Add to the list
        queryClient.setQueryData(equipmentKeys.list('equipment'), {
          ...previousDataList,
          content: [...previousDataList.content, temporaryRegion],
        })
      }

      return { previousDataList }
    },

    onSuccess: (createdData) => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: equipmentKeys.root() })

      // Add the newly created equipment to cache
      queryClient.setQueryData(equipmentKeys.detail('equipment', createdData.data.id!), createdData)
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousDataList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), context.previousDataList)
      }
    },
  })
}
