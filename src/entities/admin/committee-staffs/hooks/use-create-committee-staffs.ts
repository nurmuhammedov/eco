import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { committeeStaffAPI } from '../models/committee-staffs.api'
import { committeeStaffKeys } from '../models/committee-staffs.query-keys'
import { CommitteeStaffResponse } from '../models/committee-staffs.types'
import { CreateCommitteeStaffDTO } from '../models/committee-staffs.schema'

export const useCreateCommitteeStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: committeeStaffAPI.create,

    onMutate: async (newData: CreateCommitteeStaffDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: committeeStaffKeys.list('committee-staff'),
      })

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<CommitteeStaffResponse>>(
        committeeStaffKeys.list('committee-staff')
      )

      if (previousList) {
        // Create a temporary committee-staff with fake ID
        const temporaryData: CreateCommitteeStaffDTO & { id: number } = {
          ...newData,
          id: -Date.now(), // Temporary negative ID to identify new items
        }

        // Add to the list
        queryClient.setQueryData(committeeStaffKeys.list('committee-staff'), {
          ...previousList,
          content: [...previousList.content, temporaryData],
        })
      }

      return { previousList }
    },

    onSuccess: (createdData) => {
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: committeeStaffKeys.list('committee-staff'),
      })

      // Add the newly created committee-staff to cache
      queryClient.setQueryData(committeeStaffKeys.detail('committee-staff', createdData.data.id), createdData)
    },

    onError: (_err, _newData, context) => {
      // Revert optimistic updates on error
      if (context?.previousList) {
        queryClient.setQueryData(committeeStaffKeys.list('committee-staff'), context.previousList)
      }
    },
  })
}
