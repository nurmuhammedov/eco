import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateTerritorialDepartmentsDTO,
  TerritorialDepartmentResponse,
  territorialDepartmentsAPI,
  territorialDepartmentsKeys,
} from '@/entities/admin/territorial-departments';

export const useCreateTerritorialDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: territorialDepartmentsAPI.create,

    onMutate: async (newData: CreateTerritorialDepartmentsDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      });

      // Capture current state for rollback
      const previousList = queryClient.getQueryData<
        ResponseData<TerritorialDepartmentResponse>
      >(territorialDepartmentsKeys.list('territorial-departments'));

      if (previousList) {
        // Create a temporary territorial-departments with fake ID
        const temporaryData: CreateTerritorialDepartmentsDTO & { id: number } =
          {
            ...newData,
            id: -Date.now(), // Temporary negative ID to identify new items
          };

        // Add to the list
        queryClient.setQueryData(
          territorialDepartmentsKeys.list('territorial-departments'),
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
        queryKey: territorialDepartmentsKeys.list('territorial-departments'),
      });

      // Add the newly created territorial-departments to cache
      queryClient.setQueryData(
        territorialDepartmentsKeys.detail(
          'territorial-departments',
          createdData.data.id!,
        ),
        createdData,
      );
    },

    onError: (_err, _newData, context) => {
      // Revert optimistic updates on error
      if (context?.previousList) {
        queryClient.setQueryData(
          territorialDepartmentsKeys.list('territorial-departments'),
          context.previousList,
        );
      }
    },
  });
};
