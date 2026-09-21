import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { territorialStaffAPI } from '../models/territorial-staffs.api'
import { territorialStaffKeys } from '../models/territorial-staffs.query-keys'
import { TerritorialStaffResponse } from '../models/territorial-staffs.types'

export const useDeleteTerritorialStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: territorialStaffAPI.delete,

    onMutate: async (id: string) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialStaffKeys.list('territorial-staff'),
      })
      await queryClient.cancelQueries({
        queryKey: territorialStaffKeys.detail('territorial-staff', id),
      })

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<TerritorialStaffResponse>>(
        territorialStaffKeys.list('territorial-staff')
      )
      const previousDetail = queryClient.getQueryData<TerritorialStaffResponse>(
        territorialStaffKeys.detail('territorial-staff', id)
      )

      // Optimistically remove from lists
      if (previousList) {
        queryClient.setQueryData(territorialStaffKeys.list('territorial-staff'), {
          ...previousList,
          content: previousList.content.filter((district) => district.id !== id),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: territorialStaffKeys.detail('territorial-staff', id),
      })

      return { previousList, previousDetail }
    },

    onSuccess: () => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: territorialStaffKeys.root() })
    },

    onError: (_err, id, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(territorialStaffKeys.detail('territorial-staff', id), context.previousDetail)
      }

      // Restore list cache
      if (context?.previousList) {
        queryClient.setQueryData(territorialStaffKeys.list('territorial-staff'), context.previousList)
      }
    },
  })
}
