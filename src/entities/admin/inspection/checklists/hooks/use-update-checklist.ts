import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inspectionChecklistAPI as checklistAPI, checklistKeys, UpdateChecklistDTO } from '@/entities/admin/inspection';

export const useUpdateChecklist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checklistAPI.updateChecklist,

    onMutate: async (checklistUpdate: UpdateChecklistDTO) => {
      if (!checklistUpdate.id) {
        throw new Error('Cannot update checklist without ID');
      }

      await queryClient.cancelQueries({
        queryKey: checklistKeys.detail('checklist', checklistUpdate.id),
      });
      await queryClient.cancelQueries({
        queryKey: checklistKeys.list('checklist'),
      });

      const previousChecklistDetail = queryClient.getQueryData<UpdateChecklistDTO>(
        checklistKeys.detail('checklist', checklistUpdate.id),
      );
      const previousChecklistsList = queryClient.getQueryData<ResponseData<UpdateChecklistDTO>>(
        checklistKeys.list('checklist'),
      );

      queryClient.setQueryData(checklistKeys.detail('checklist', checklistUpdate.id), checklistUpdate);

      if (previousChecklistsList) {
        queryClient.setQueryData(checklistKeys.list('checklist'), {
          ...previousChecklistsList,
          content: previousChecklistsList.content.map((checklist) =>
            checklist.id === checklistUpdate.id ? checklistUpdate : checklist,
          ),
        });
      }

      return { previousChecklistDetail, previousChecklistsList };
    },

    onSuccess: (updatedChecklist) => {
      if (updatedChecklist.data.id) {
        queryClient.setQueryData(checklistKeys.detail('checklist', updatedChecklist.data.id), updatedChecklist);
      }

      queryClient.invalidateQueries({
        queryKey: checklistKeys.list('checklist'),
      });
    },

    onError: (_err, updatedChecklist, context) => {
      if (context?.previousChecklistDetail) {
        queryClient.setQueryData(
          checklistKeys.detail('checklist', updatedChecklist.id),
          context.previousChecklistDetail,
        );
      }

      if (context?.previousChecklistsList) {
        queryClient.setQueryData(checklistKeys.list('checklist'), context.previousChecklistsList);
      }
    },
  });
};
