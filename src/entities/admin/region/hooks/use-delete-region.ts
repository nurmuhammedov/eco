import { regionAPI, regionKeys, type RegionResponse } from '@/entities/admin/region';
import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regionAPI.deleteRegion,

    onMutate: async (regionId: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: regionKeys.list('region'),
      });
      await queryClient.cancelQueries({
        queryKey: regionKeys.detail('region', regionId),
      });

      // Capture current state for rollback
      const previousRegionsList = queryClient.getQueryData<ResponseData<RegionResponse>>(regionKeys.list('region'));
      const previousRegionDetail = queryClient.getQueryData<RegionResponse>(regionKeys.detail('region', regionId));

      // Optimistically remove from lists
      if (previousRegionsList) {
        queryClient.setQueryData(regionKeys.list('region'), {
          ...previousRegionsList,
          content: previousRegionsList.content.filter((district) => district.id !== regionId),
        });
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: regionKeys.detail('region', regionId),
      });

      return { previousRegionsList, previousRegionDetail };
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: regionKeys.list('region'),
      });
    },

    onError: (_err, regionId, context) => {
      // Restore detail cache if it existed
      if (context?.previousRegionDetail) {
        queryClient.setQueryData(regionKeys.detail('region', regionId), context.previousRegionDetail);
      }

      // Restore list cache
      if (context?.previousRegionsList) {
        queryClient.setQueryData(regionKeys.list('region'), context.previousRegionsList);
      }
    },
  });
};
