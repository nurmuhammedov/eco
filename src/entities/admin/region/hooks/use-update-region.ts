import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  regionAPI,
  regionKeys,
  type UpdateRegionDTO,
} from '@/entities/admin/region';

export const useUpdateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regionAPI.updateRegion,

    onMutate: async (regionUpdate: UpdateRegionDTO) => {
      // Ensure we have a valid ID
      if (!regionUpdate.id) {
        throw new Error('Cannot update region without ID');
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: regionKeys.detail('region', regionUpdate.id),
      });
      await queryClient.cancelQueries({
        queryKey: regionKeys.list('region'),
      });

      // Capture current states for rollback
      const previousRegionDetail = queryClient.getQueryData<UpdateRegionDTO>(
        regionKeys.detail('region', regionUpdate.id),
      );

      const previousRegionsList = queryClient.getQueryData<
        ResponseData<UpdateRegionDTO>
      >(regionKeys.list('region'));

      // Update region detail
      queryClient.setQueryData(
        regionKeys.detail('region', regionUpdate.id),
        regionUpdate,
      );

      // Update region in lists
      if (previousRegionsList) {
        queryClient.setQueryData(regionKeys.list('region'), {
          ...previousRegionsList,
          content: previousRegionsList.content.map((district) =>
            district.id === regionUpdate.id ? regionUpdate : district,
          ),
        });
      }

      return { previousRegionDetail, previousRegionsList };
    },

    onSuccess: (updatedDistrict) => {
      // Set the updated region in cache
      if (updatedDistrict.data.id) {
        queryClient.setQueryData(
          regionKeys.detail('region', updatedDistrict.data.id),
          updatedDistrict,
        );
      }

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: regionKeys.list('region'),
      });
    },

    onError: (_err, updatedDistrict, context) => {
      // Revert region detail on error
      if (context?.previousRegionDetail) {
        queryClient.setQueryData(
          regionKeys.detail('region', updatedDistrict.id),
          context.previousRegionDetail,
        );
      }

      // Revert region in lists
      if (context?.previousRegionsList) {
        queryClient.setQueryData(
          regionKeys.list('region'),
          context.previousRegionsList,
        );
      }
    },
  });
};
