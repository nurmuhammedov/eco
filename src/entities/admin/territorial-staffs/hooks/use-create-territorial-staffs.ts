import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateTerritorialStaffDTO,
  territorialStaffAPI,
  territorialStaffKeys,
  TerritorialStaffResponse,
} from '@/entities/admin/territorial-staffs'

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
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: territorialStaffKeys.list('territorial-staff'),
      })

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
