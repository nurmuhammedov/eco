import type { District } from './types';
import { districtQueryKeys } from './query-keys';
import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createOrUpdateDistrict,
  deleteDistrict,
  fetchDistrictById,
  fetchDistricts,
} from './fetcher';

export const useDistrictsPaged = <T extends Record<string, unknown>>(
  params: T,
) =>
  useQuery({
    staleTime: 10 * 60 * 1000,
    queryFn: () => fetchDistricts(params),
    queryKey: districtQueryKeys.list(params),
    placeholderData: (previousData) => previousData,
  });

export const useDistrictById = (id: number) =>
  useQuery({
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    queryFn: () => fetchDistrictById(id),
    queryKey: districtQueryKeys.detail(id),
    placeholderData: (previousData) => previousData,
  });

export const useSaveDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrUpdateDistrict,

    onMutate: async (newDistrict) => {
      await queryClient.cancelQueries({ queryKey: districtQueryKeys.all() });

      const prevDistricts = queryClient.getQueryData<ResponseData<District>>(
        districtQueryKeys.all(),
      );

      if (prevDistricts) {
        queryClient.setQueryData(districtQueryKeys.all(), {
          ...prevDistricts,
          content: [
            ...prevDistricts.content.filter((d) => d.id !== newDistrict.id),
            { id: newDistrict.id || Date.now(), ...newDistrict },
          ],
        });
      }

      return { prevDistricts };
    },

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: districtQueryKeys.all() }),

    onError: (_err, _newDistrict, context) => {
      if (context?.prevDistricts) {
        queryClient.setQueryData(
          districtQueryKeys.all(),
          context.prevDistricts,
        );
      }
    },
  });
};

export const useDeleteDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDistrict,

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: districtQueryKeys.all() });

      const prevDistricts = queryClient.getQueryData<ResponseData<District>>(
        districtQueryKeys.all(),
      );

      if (prevDistricts) {
        queryClient.setQueryData(districtQueryKeys.all(), {
          ...prevDistricts,
          content: prevDistricts.content.filter((d) => d.id !== id),
        });
      }

      return { prevDistricts };
    },

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: districtQueryKeys.all() }),

    onError: (_err, _id, context) => {
      if (context?.prevDistricts) {
        queryClient.setQueryData(
          districtQueryKeys.all(),
          context.prevDistricts,
        );
      }
    },
  });
};
