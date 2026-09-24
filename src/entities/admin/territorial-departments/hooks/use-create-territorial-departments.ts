import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'
import { CreateTerritorialDepartmentsDTO, TerritorialDepartmentResponse } from '../model/territorial-departments.types'
import { territorialDepartmentsAPI } from '../model/territorial-departments.api'
import { territorialDepartmentsKeys } from '../model/territorial-departments.query-keys'
import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateTerritorialDepartment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: territorialDepartmentsAPI.create,

    onMutate: async (newData: CreateTerritorialDepartmentsDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      })

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<TerritorialDepartmentResponse>>(
        territorialDepartmentsKeys.list('territorial-departments')
      )

      if (previousList) {
        // Create a temporary territorial-departments with fake ID
        const temporaryData: CreateTerritorialDepartmentsDTO & { id: number } = {
          ...newData,
          id: -Date.now(), // Temporary negative ID to identify new items
        }

        // Add to the list
        queryClient.setQueryData(territorialDepartmentsKeys.list('territorial-departments'), {
          ...previousList,
          content: [...previousList.content, temporaryData],
        })
      }

      return { previousList }
    },

    onSuccess: (createdData) => {
      // The whole slice: lists, details and the selects that read the same data
      queryClient.invalidateQueries({ queryKey: territorialDepartmentsKeys.root() })
      invalidateEndpoint(queryClient, API_ENDPOINTS.OFFICES)

      // Add the newly created territorial-departments to cache
      if (createdData.data.id) {
        queryClient.setQueryData(
          territorialDepartmentsKeys.detail('territorial-departments', createdData.data.id),
          createdData
        )
      }
    },

    onError: (_err, _newData, context) => {
      // Revert optimistic updates on error
      if (context?.previousList) {
        queryClient.setQueryData(territorialDepartmentsKeys.list('territorial-departments'), context.previousList)
      }
    },
  })
}
