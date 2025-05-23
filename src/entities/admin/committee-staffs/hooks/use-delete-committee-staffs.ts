import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { committeeStaffAPI, committeeStaffKeys, CommitteeStaffResponse } from '@/entities/admin/committee-staffs';

export const useDeleteCommitteeStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: committeeStaffAPI.delete,

    onMutate: async (id: string) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: committeeStaffKeys.list('committee-staff'),
      });
      await queryClient.cancelQueries({
        queryKey: committeeStaffKeys.detail('committee-staff', id),
      });

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<ResponseData<CommitteeStaffResponse>>(
        committeeStaffKeys.list('committee-staff'),
      );
      const previousDetail = queryClient.getQueryData<CommitteeStaffResponse>(
        committeeStaffKeys.detail('committee-staff', id),
      );

      // Optimistically remove from lists
      if (previousList) {
        queryClient.setQueryData(committeeStaffKeys.list('committee-staff'), {
          ...previousList,
          content: previousList.content.filter((district) => district.id !== id),
        });
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: committeeStaffKeys.detail('committee-staff', id),
      });

      return { previousList, previousDetail };
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: committeeStaffKeys.list('committee-staff'),
      });
    },

    onError: (_err, id, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(committeeStaffKeys.detail('committee-staff', id), context.previousDetail);
      }

      // Restore list cache
      if (context?.previousList) {
        queryClient.setQueryData(committeeStaffKeys.list('committee-staff'), context.previousList);
      }
    },
  });
};
