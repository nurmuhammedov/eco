import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  centralApparatusAPI,
  centralApparatusKeys,
  CentralApparatusResponse,
  CreateCentralApparatusDTO,
} from '@/entities/admin/central-apparatus';

export const useCreateCentralApparatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: centralApparatusAPI.create,

    onMutate: async (newData: CreateCentralApparatusDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: centralApparatusKeys.list('central-apparatus'),
      });

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<
        ResponseData<CentralApparatusResponse>
      >(centralApparatusKeys.list('central-apparatus'));

      if (previousList) {
        // Create a temporary central-apparatus with fake ID
        const temporaryData: CreateCentralApparatusDTO & { id: number } = {
          ...newData,
          id: -Date.now(), // Temporary negative ID to identify new items
        };

        // Add to the list
        queryClient.setQueryData(
          centralApparatusKeys.list('central-apparatus'),
          {
            ...previousList,
            content: [...previousList.content, temporaryData],
          },
        );
      }

      return { previousList };
    },

    onSuccess: (createdData) => {
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: centralApparatusKeys.list('central-apparatus'),
      });

      // Add the newly created central-apparatus to cache
      queryClient.setQueryData(
        centralApparatusKeys.detail('central-apparatus', createdData.data.id!),
        createdData,
      );
    },

    onError: (_err, _newData, context) => {
      // Revert optimistic updates on error
      if (context?.previousList) {
        queryClient.setQueryData(
          centralApparatusKeys.list('central-apparatus'),
          context.previousList,
        );
      }
    },
  });
};
