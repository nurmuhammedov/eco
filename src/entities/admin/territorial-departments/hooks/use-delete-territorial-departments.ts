import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TerritorialDepartmentResponse,
  territorialDepartmentsAPI,
  territorialDepartmentsKeys,
} from '@/entities/admin/territorial-departments'

export const useDeleteTerritorialDepartments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: territorialDepartmentsAPI.delete,

    onMutate: async (id: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      })
      await queryClient.cancelQueries({
        queryKey: territorialDepartmentsKeys.detail('territorial-departments', id),
      })

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<TerritorialDepartmentResponse>>(
        territorialDepartmentsKeys.list('territorial-departments')
      )
      const previousDetail = queryClient.getQueryData<TerritorialDepartmentResponse>(
        territorialDepartmentsKeys.detail('territorial-departments', id)
      )

      // Optimistically remove from lists
      if (previousList) {
        queryClient.setQueryData(territorialDepartmentsKeys.list('territorial-departments'), {
          ...previousList,
          content: previousList.content.filter((district) => district.id !== id),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: territorialDepartmentsKeys.detail('territorial-departments', id),
      })

      return { previousList, previousDetail }
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      })
    },

    onError: (_err, id, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(
          territorialDepartmentsKeys.detail('territorial-departments', id),
          context.previousDetail
        )
      }

      // Restore list cache
      if (context?.previousList) {
        queryClient.setQueryData(territorialDepartmentsKeys.list('territorial-departments'), context.previousList)
      }
    },
  })
}
