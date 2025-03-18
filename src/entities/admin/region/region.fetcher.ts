import type { ResponseData } from '@/shared/types/api';
import { regionAPI } from '@/entities/admin/region/region.api';
import { regionKeys } from '@/entities/admin/region/region.query-keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateRegionDTO, Region, UpdateRegionDTO } from './region.types';

const DISTRICT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useRegionsQuery = (filters: any) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => regionAPI.fetchRegions(filters),
    queryKey: regionKeys.list('region', filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useRegionQuery = (id: number) => {
  return useQuery({
    enabled: !!id,
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => regionAPI.fetchRegion(id),
    queryKey: regionKeys.detail('region', id),
    placeholderData: (previousData) => previousData,
  });
};

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
      const previousRegionsList = queryClient.getQueryData<
        ResponseData<Region>
      >(regionKeys.list('region'));

      if (previousRegionsList) {
        // Create a temporary region with fake ID
        const temporaryDistrict: CreateRegionDTO & { id: number } = {
          ...newRegionData,
          id: -Date.now(), // Temporary negative ID to identify new items
        };

        // Add to the list
        queryClient.setQueryData(regionKeys.list('region'), {
          ...previousRegionsList,
          content: [...previousRegionsList.content, temporaryDistrict],
        });
      }

      return { previousRegionsList };
    },

    onSuccess: (createdRegion) => {
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: regionKeys.list('region'),
      });

      // Add the newly created district to cache
      queryClient.setQueryData(
        regionKeys.detail('region', createdRegion.id),
        createdRegion,
      );
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousRegionsList) {
        queryClient.setQueryData(
          regionKeys.list('region'),
          context.previousRegionsList,
        );
      }
    },
  });
};

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
      queryClient.setQueryData(
        regionKeys.detail('region', updatedDistrict.id),
        updatedDistrict,
      );

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

/**
 * Hook for deleting a district
 */
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
      const previousRegionsList = queryClient.getQueryData<
        ResponseData<Region>
      >(regionKeys.list('region'));
      const previousRegionDetail = queryClient.getQueryData<Region>(
        regionKeys.detail('region', regionId),
      );

      // Optimistically remove from lists
      if (previousRegionsList) {
        queryClient.setQueryData(regionKeys.list('region'), {
          ...previousRegionsList,
          content: previousRegionsList.content.filter(
            (district) => district.id !== regionId,
          ),
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
        queryClient.setQueryData(
          regionKeys.detail('region', regionId),
          context.previousRegionDetail,
        );
      }

      // Restore list cache
      if (context?.previousRegionsList) {
        queryClient.setQueryData(
          regionKeys.list('region'),
          context.previousRegionsList,
        );
      }
    },
  });
};
