import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  centralApparatusAPI,
  centralApparatusKeys,
  type UpdateCentralApparatusDTO,
} from '@/entities/admin/central-apparatus'

export const useUpdateCentralApparatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: centralApparatusAPI.update,

    onMutate: async (updateData: UpdateCentralApparatusDTO) => {
      // Ensure we have a valid ID
      if (!updateData.id) {
        throw new Error('Cannot update central-apparatus without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: centralApparatusKeys.detail('central-apparatus', updateData.id),
      })
      await queryClient.cancelQueries({
        queryKey: centralApparatusKeys.list('central-apparatus'),
      })

      // Capture current states for rollback
      const previousDetail = queryClient.getQueryData<UpdateCentralApparatusDTO>(
        centralApparatusKeys.detail('central-apparatus', updateData.id)
      )

      const previousList = queryClient.getQueryData<ResponseData<UpdateCentralApparatusDTO>>(
        centralApparatusKeys.list('central-apparatus')
      )

      // Update central-apparatus detail
      queryClient.setQueryData(centralApparatusKeys.detail('central-apparatus', updateData.id), updateData)

      // Update central-apparatus in lists
      if (previousList) {
        queryClient.setQueryData(centralApparatusKeys.list('central-apparatus'), {
          ...previousList,
          content: previousList.content.map((district) => (district.id === updateData.id ? updateData : district)),
        })
      }

      return { previousDetail, previousList }
    },

    onSuccess: (updatedData) => {
      // Set the updated central-apparatus in cache
      if (updatedData.data.id) {
        queryClient.setQueryData(centralApparatusKeys.detail('central-apparatus', updatedData.data.id), updatedData)
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: centralApparatusKeys.list('central-apparatus'),
      })
    },

    onError: (_err, updatedData, context) => {
      // Revert central-apparatus detail on error
      if (context?.previousDetail) {
        queryClient.setQueryData(
          centralApparatusKeys.detail('central-apparatus', updatedData.id),
          context.previousDetail
        )
      }

      // Revert central-apparatus in lists
      if (context?.previousList) {
        queryClient.setQueryData(centralApparatusKeys.list('central-apparatus'), context.previousList)
      }
    },
  })
}
