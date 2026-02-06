import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
// Asosiy exportlarni eski yo‘ldan qoldiramiz
import { committeeStaffAPI, committeeStaffKeys } from '@/entities/admin/committee-staffs'

import type { UpdateCommitteeStaffDTO } from '../models/committee-staffs.schema'

export const useUpdateCommitteeStaff = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: committeeStaffAPI.update,

    onMutate: async (updateData: UpdateCommitteeStaffDTO) => {
      // Ensure we have a valid ID
      if (!updateData.id) {
        throw new Error('Cannot update committee-staff without ID')
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: committeeStaffKeys.detail('committee-staff', updateData.id),
      })
      await queryClient.cancelQueries({
        queryKey: committeeStaffKeys.list('committee-staff'),
      })

      // Capture current states for rollback
      const previousDetail = queryClient.getQueryData<UpdateCommitteeStaffDTO>(
        committeeStaffKeys.detail('committee-staff', updateData.id)
      )

      const previousList = queryClient.getQueryData<ResponseData<UpdateCommitteeStaffDTO>>(
        committeeStaffKeys.list('committee-staff')
      )

      // Update committee-staff detail
      queryClient.setQueryData(committeeStaffKeys.detail('committee-staff', updateData.id), updateData)

      // Update committee-staff in lists
      if (previousList) {
        queryClient.setQueryData(committeeStaffKeys.list('committee-staff'), {
          ...previousList,
          content: previousList.content.map((district) => (district.id === updateData.id ? updateData : district)),
        })
      }

      return { previousDetail, previousList }
    },

    onSuccess: (updatedData) => {
      // Set the updated committee-staff in cache
      if (updatedData.data.id) {
        queryClient.setQueryData(committeeStaffKeys.detail('committee-staff', updatedData.data.id), updatedData)
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: committeeStaffKeys.list('committee-staff'),
      })
    },

    onError: (_err, updatedData, context) => {
      // `updatedData.id` mavjud bo‘lsagina keshni eski holatiga qaytaramiz
      if (updatedData.id && context?.previousDetail) {
        queryClient.setQueryData(committeeStaffKeys.detail('committee-staff', updatedData.id), context.previousDetail)
      }

      // Ro‘yxatni eski holatiga qaytarishda ID kerak emas, shuning uchun bu o‘zgarmaydi
      if (context?.previousList) {
        queryClient.setQueryData(committeeStaffKeys.list('committee-staff'), context.previousList)
      }
    },
  })
}
