import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateDistrictDTO, districtAPI, districtKeys, DistrictResponse } from '@/entities/admin/districts';

export const useCreateDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: districtAPI.createDistrict,

    onMutate: async (newDistrictData: CreateDistrictDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: districtKeys.list('district'),
      });

      // Capture current state for rollback
      const previousDistrictsList = queryClient.getQueryData<ResponseData<DistrictResponse>>(
        districtKeys.list('district'),
      );

      if (previousDistrictsList) {
        // Create a temporary district with fake ID
        const temporaryRegion: CreateDistrictDTO & { id: number } = {
          ...newDistrictData,
          id: -Date.now(), // Temporary negative ID to identify new items
        };

        // Add to the list
        queryClient.setQueryData(districtKeys.list('district'), {
          ...previousDistrictsList,
          content: [...previousDistrictsList.content, temporaryRegion],
        });
      }

      return { previousDistrictsList };
    },

    onSuccess: (createdDistrict) => {
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: districtKeys.list('district'),
      });

      // Add the newly created district to cache
      queryClient.setQueryData(districtKeys.detail('district', createdDistrict.data.id!), createdDistrict);
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), context.previousDistrictsList);
      }
    },
  });
};
