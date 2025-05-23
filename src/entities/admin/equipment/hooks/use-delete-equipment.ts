import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentAPI, equipmentKeys, EquipmentResponse } from '@/entities/admin/equipment';

export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: equipmentAPI.delete,

    onMutate: async (id: number) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.list('equipment'),
      });
      await queryClient.cancelQueries({
        queryKey: equipmentKeys.detail('equipment', id),
      });

      // Capture current state for rollback
      const previousDistrictsList = queryClient.getQueryData<ResponseData<EquipmentResponse>>(
        equipmentKeys.list('equipment'),
      );
      const previousDetail = queryClient.getQueryData<EquipmentResponse>(equipmentKeys.detail('equipment', id));

      // Optimistically remove from lists
      if (previousDistrictsList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), {
          ...previousDistrictsList,
          content: previousDistrictsList.content.filter((equipment) => equipment.id !== id),
        });
      }

      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: equipmentKeys.detail('equipment', id),
      });

      return { previousDistrictsList, previousDetail };
    },

    onSuccess: () => {
      // Invalidate list queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.list('equipment'),
      });
    },

    onError: (_err, id, context) => {
      // Restore detail cache if it existed
      if (context?.previousDetail) {
        queryClient.setQueryData(equipmentKeys.detail('equipment', id), context.previousDetail);
      }

      // Restore list cache
      if (context?.previousDistrictsList) {
        queryClient.setQueryData(equipmentKeys.list('equipment'), context.previousDistrictsList);
      }
    },
  });
};
