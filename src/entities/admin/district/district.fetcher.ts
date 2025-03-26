import type { ResponseData } from '@/shared/types/api';
import {
  CreateDistrictDTO,
  District,
  UpdateDistrictDTO,
} from './district.types.ts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { districtKeys } from '@/entities/admin/district/district.query-keys.ts';
import { districtAPI } from '@/entities/admin/district/district.api.ts';

const DISTRICT_STALE_TIME = 10 * 60 * 1000; // 10 minutes

export const useDistrictsQuery = (filters: any) => {
  return useQuery({
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => districtAPI.fetchDistricts(filters),
    queryKey: districtKeys.list('district', filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useDistrictQuery = (id: number) => {
  return useQuery({
    enabled: !!id,
    staleTime: DISTRICT_STALE_TIME,
    queryFn: () => districtAPI.fetchDistrict(id),
    queryKey: districtKeys.detail('district', id),
    placeholderData: (previousData) => previousData,
  });
};

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
      const previousDistrictsList = queryClient.getQueryData<
        ResponseData<District>
      >(districtKeys.list('district'));

      if (previousDistrictsList) {
        // Create a temporary regions with fake ID
        const temporaryDistrict: CreateDistrictDTO & { id: number } = {
          ...newDistrictData,
          id: -Date.now(), // Temporary negative ID to identify new items
        };

        // Add to the list
        queryClient.setQueryData(districtKeys.list('district'), {
          ...previousDistrictsList,
          content: [...previousDistrictsList.content, temporaryDistrict],
        });
      }

      return { previousDistrictsList };
    },

    onSuccess: (createdDistrict) => {
      // Invalidate list queries to get fresh data with correct ID
      queryClient.invalidateQueries({
        queryKey: districtKeys.list('district'),
      });

      // Add the newly created regions to cache
      queryClient.setQueryData(
        districtKeys.detail('district', createdDistrict.id),
        createdDistrict,
      );
    },

    onError: (_err, _newDistrict, context) => {
      // Revert optimistic updates on error
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(
          districtKeys.list('district'),
          context.previousDistrictsList,
        );
      }
    },
  });
};

export const useUpdateDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: districtAPI.updateDistrict,

    onMutate: async (districtUpdate: UpdateDistrictDTO) => {
      // Ensure we have a valid ID
      if (!districtUpdate.id) {
        throw new Error('Cannot update regions without ID');
      }

      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: districtKeys.detail('district', districtUpdate.id),
      });
      await queryClient.cancelQueries({
        queryKey: districtKeys.list('district'),
      });

      // Capture current states for rollback
      const previousDistrictDetail =
        queryClient.getQueryData<UpdateDistrictDTO>(
          districtKeys.detail('district', districtUpdate.id),
        );
      const previousDistrictsList = queryClient.getQueryData<
        ResponseData<UpdateDistrictDTO>
      >(districtKeys.list('district'));

      // Update regions detail
      queryClient.setQueryData(
        districtKeys.detail('district', districtUpdate.id),
        districtUpdate,
      );

      // Update regions in lists
      if (previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), {
          ...previousDistrictsList,
          content: previousDistrictsList.content.map((district) =>
            district.id === districtUpdate.id ? districtUpdate : district,
          ),
        });
      }

      return { previousDistrictDetail, previousDistrictsList };
    },

    onSuccess: (updatedDistrict) => {
      // Set the updated regions in cache
      queryClient.setQueryData(
        districtKeys.detail('district', updatedDistrict.id),
        updatedDistrict,
      );

      // Invalidate lists to ensure they're up-to-date
      queryClient.invalidateQueries({
        queryKey: districtKeys.list('district'),
      });
    },

    onError: (_err, updatedDistrict, context) => {
      // Revert regions detail on error
      if (context?.previousDistrictDetail) {
        queryClient.setQueryData(
          districtKeys.detail('district', updatedDistrict.id),
          context.previousDistrictDetail,
        );
      }

      // Revert regions in lists
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(
          districtKeys.list('district'),
          context.previousDistrictsList,
        );
      }
    },
  });
};

/**
 * Hook for deleting a regions
 */
export const useDeleteDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: districtAPI.deleteDistrict,

    onMutate: async (districtId: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: districtKeys.list('district'),
      });
      await queryClient.cancelQueries({
        queryKey: districtKeys.detail('district', districtId),
      });

      // Capture current state for rollback
      const previousDistrictsList = queryClient.getQueryData<
        ResponseData<District>
      >(districtKeys.list('district'));
      const previousDistrictDetail = queryClient.getQueryData<District>(
        districtKeys.detail('district', districtId),
      );

      // Optimistically remove from lists
      if (previousDistrictsList) {
        queryClient.setQueryData(districtKeys.list('district'), {
          ...previousDistrictsList,
          content: previousDistrictsList.content.filter(
            (district) => district.id !== districtId,
          ),
        });
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: districtKeys.detail('district', districtId),
      });

      return { previousDistrictsList, previousDistrictDetail };
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: districtKeys.list('district'),
      });
    },

    onError: (_err, districtId, context) => {
      // Restore detail cache if it existed
      if (context?.previousDistrictDetail) {
        queryClient.setQueryData(
          districtKeys.detail('district', districtId),
          context.previousDistrictDetail,
        );
      }

      // Restore list cache
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(
          districtKeys.list('district'),
          context.previousDistrictsList,
        );
      }
    },
  });
};
