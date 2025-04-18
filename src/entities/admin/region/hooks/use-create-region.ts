import { CreateRegionDTO, regionKeys, RegionResponse } from '@/entities/admin/region';
import type { ResponseData } from '@/shared/types/api';
import { regionAPI } from '@/entities/admin/region/models/region.api.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regionAPI.createRegion,

    onMutate: async (newRegionData: CreateRegionDTO) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: regionKeys.list('region'),
      });

      // Capture current state for rollback
      const previousRegionsList = queryClient.getQueryData<ResponseData<RegionResponse>>(regionKeys.list('region'));

      if (previousRegionsList) {
        // Create a temporary region with fake ID
        const temporaryRegion: CreateRegionDTO & { id: number } = {
          ...newRegionData,
          id: -Date.now(), // Temporary negative ID to identify new items
        };

        // Add to the list
        queryClient.setQueryData(regionKeys.list('region'), {
          ...previousRegionsList,
          content: [...previousRegionsList.content, temporaryRegion],
        });
      }

      return { previousRegionsList };
    },

    onSuccess: (createdRegion) => {
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: regionKeys.list('region'),
      });

      // Add the newly created region to cache
      queryClient.setQueryData(regionKeys.detail('region', createdRegion.data.id!), createdRegion);
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousRegionsList) {
        queryClient.setQueryData(regionKeys.list('region'), context.previousRegionsList);
      }
    },
  });
};
