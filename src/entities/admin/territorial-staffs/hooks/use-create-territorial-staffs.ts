import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateTerritorialStaffDTO, TerritorialStaffResponse } from '../model/territorial-staffs.types'
import { territorialStaffAPI } from '../model/territorial-staffs.api'
import { territorialStaffKeys } from '../model/territorial-staffs.query-keys'

export const useCreateTerritorialStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: territorialStaffAPI.create,

    onMutate: async (newData: CreateTerritorialStaffDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialStaffKeys.list('territorial-staff'),
      })

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<TerritorialStaffResponse>>(
        territorialStaffKeys.list('territorial-staff')
      )

      if (previousList) {
        // Create a temporary territorial-staff with fake ID
        const temporaryData: CreateTerritorialStaffDTO & { id: number } = {
          ...newData,
          id: -Date.now(), // Temporary negative ID to identify new items
        }

        // Add to the list
        queryClient.setQueryData(territorialStaffKeys.list('territorial-staff'), {
          ...previousList,
          content: [...previousList.content, temporaryData],
        })
      }

      return { previousList }
    },

    onSuccess: (createdData) => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: territorialStaffKeys.root() })

      // Add the newly created territorial-staff to cache
      queryClient.setQueryData(territorialStaffKeys.detail('territorial-staff', createdData.data.id), createdData)
    },

    onError: (_err, _newData, context) => {
      // Revert optimistic updates on error
      if (context?.previousList) {
        queryClient.setQueryData(territorialStaffKeys.list('territorial-staff'), context.previousList)
      }
    },
  })
}
