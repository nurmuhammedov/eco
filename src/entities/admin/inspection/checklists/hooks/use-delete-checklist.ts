import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { inspectionChecklistAPI as checklistAPI, checklistKeys, ChecklistResponse } from '@/entities/admin/inspection'

export const useDeleteChecklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: checklistAPI.deleteChecklist,

    onMutate: async (checklistId: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: checklistKeys.list('checklist'),
      })
      await queryClient.cancelQueries({
        queryKey: checklistKeys.detail('checklist', checklistId),
      })

      // Capture current state for rollback
      const previousChecklistsList = queryClient.getQueryData<ResponseData<ChecklistResponse>>(
        checklistKeys.list('checklist')
      )
      const previousChecklistDetail = queryClient.getQueryData<ChecklistResponse>(
        checklistKeys.detail('checklist', checklistId)
      )

      // Optimistically remove from lists
      if (previousChecklistsList) {
        queryClient.setQueryData(checklistKeys.list('checklist'), {
          ...previousChecklistsList,
          content: previousChecklistsList.content.filter((checklist) => checklist.id !== checklistId),
        })
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: checklistKeys.detail('checklist', checklistId),
      })

      return { previousChecklistsList, previousChecklistDetail }
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: checklistKeys.list('checklist'),
      })
    },

    onError: (_err, checklistId, context) => {
      // Restore detail cache if it existed
      if (context?.previousChecklistDetail) {
        queryClient.setQueryData(checklistKeys.detail('checklist', checklistId), context.previousChecklistDetail)
      }

      // Restore list cache
      if (context?.previousChecklistsList) {
        queryClient.setQueryData(checklistKeys.list('checklist'), context.previousChecklistsList)
      }
    },
  })
}
