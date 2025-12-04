import {
  territorialDepartmentsAPI,
  territorialDepartmentsKeys,
  type UpdateTerritorialDepartmentsDTO,
} from '@/entities/admin/territorial-departments'
import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useUpdateTerritorialDepartments = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: territorialDepartmentsAPI.update,

    onMutate: async (updateData: UpdateTerritorialDepartmentsDTO) => {
      // Ensure we have a valid ID
      if (!updateData.id) {
        throw new Error('Cannot update territorial-departments without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialDepartmentsKeys.detail('territorial-departments', updateData.id),
      })
      await queryClient.cancelQueries({
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      })

      // Capture current states for rollback
      const previousDetail = queryClient.getQueryData<UpdateTerritorialDepartmentsDTO>(
        territorialDepartmentsKeys.detail('territorial-departments', updateData.id)
      )

      const previousList = queryClient.getQueryData<ResponseData<UpdateTerritorialDepartmentsDTO>>(
        territorialDepartmentsKeys.list('territorial-departments')
      )

      // Update territorial-departments detail
      queryClient.setQueryData(territorialDepartmentsKeys.detail('territorial-departments', updateData.id), updateData)

      // Update territorial-departments in lists
      if (previousList) {
        queryClient.setQueryData(territorialDepartmentsKeys.list('territorial-departments'), {
          ...previousList,
          content: previousList.content.map((department) =>
            department.id === updateData.id ? updateData : department
          ),
        })
      }

      return { previousDetail, previousList }
    },

    onSuccess: (updatedData) => {
      // Set the updated territorial-departments in cache
      if (updatedData.data.id) {
        queryClient.setQueryData(
          territorialDepartmentsKeys.detail('territorial-departments', updatedData.data.id),
          updatedData
        )
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      })
    },

    onError: (_err, updatedData, context) => {
      // Revert territorial-departments detail on error
      if (context?.previousDetail) {
        queryClient.setQueryData(
          territorialDepartmentsKeys.detail('territorial-departments', updatedData.id),
          context.previousDetail
        )
      }

      // Revert territorial-departments in lists
      if (context?.previousList) {
        queryClient.setQueryData(territorialDepartmentsKeys.list('territorial-departments'), context.previousList)
      }
    },
  })
}
