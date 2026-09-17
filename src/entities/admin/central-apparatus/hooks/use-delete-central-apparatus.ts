import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { centralApparatusAPI } from '../models/central-apparatus.api'
import { centralApparatusKeys } from '../models/central-apparatus.query-keys'
import { CentralApparatusResponse } from '../models/central-apparatus.types'

export const useDeleteCentralApparatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: centralApparatusAPI.delete,

    onMutate: async (id: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: centralApparatusKeys.list('central-apparatus'),
      })
      await queryClient.cancelQueries({
        queryKey: centralApparatusKeys.detail('central-apparatus', id),
      })

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<CentralApparatusResponse>>(
        centralApparatusKeys.list('central-apparatus')
      )
      const previousDetail = queryClient.getQueryData<CentralApparatusResponse>(
        centralApparatusKeys.detail('central-apparatus', id)
      )

      // Optimistically remove from lists
      if (previousList) {
        queryClient.setQueryData(centralApparatusKeys.list('central-apparatus'), {
          ...previousList,
          content: previousList.content.filter((district) => district.id !== id),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: centralApparatusKeys.detail('central-apparatus', id),
      })

      return { previousList, previousDetail }
    },

    onSuccess: () => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: centralApparatusKeys.root() })
      invalidateEndpoint(queryClient, API_ENDPOINTS.DEPARTMENTS)
    },

    onError: (_err, id, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(centralApparatusKeys.detail('central-apparatus', id), context.previousDetail)
      }

      // Restore list cache
      if (context?.previousList) {
        queryClient.setQueryData(centralApparatusKeys.list('central-apparatus'), context.previousList)
      }
    },
  })
}
