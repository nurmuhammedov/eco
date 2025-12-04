import type { ResponseData } from '@/shared/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  CreateChecklistDTO,
  inspectionChecklistAPI as checklistAPI,
  checklistKeys,
  ChecklistResponse,
} from '@/entities/admin/inspection'

export const useCreateChecklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: checklistAPI.createChecklist,

    onMutate: async (newChecklist: CreateChecklistDTO) => {
      await queryClient.cancelQueries({
        queryKey: checklistKeys.list('checklist'),
      })

      const previousChecklists = queryClient.getQueryData<ResponseData<ChecklistResponse>>(
        checklistKeys.list('checklist')
      )

      if (previousChecklists) {
        const tempChecklist: CreateChecklistDTO & { id: number } = {
          ...newChecklist,
          id: -Date.now(),
        }

        queryClient.setQueryData(checklistKeys.list('checklist'), {
          ...previousChecklists,
          content: [...previousChecklists.content, tempChecklist],
        })
      }

      return { previousChecklists }
    },

    onSuccess: (createdChecklist) => {
      queryClient.invalidateQueries({
        queryKey: checklistKeys.list('checklist'),
      })

      queryClient.setQueryData(checklistKeys.detail('checklist', createdChecklist.data.id!), createdChecklist)
    },

    onError: (_err, _newChecklist, context) => {
      if (context?.previousChecklists) {
        queryClient.setQueryData(checklistKeys.list('checklist'), context.previousChecklists)
      }
    },
  })
}
