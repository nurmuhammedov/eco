import type { ResponseData } from '@/shared/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  inspectionCategoryTypeAPI as categoryTypeAPI,
  categoryTypeKeys,
  UpdateCategoryTypeDTO,
} from '@/entities/admin/inspection';

export const useUpdateCategoryType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryTypeAPI.updateCategoryType,

    onMutate: async (categoryTypeUpdate: UpdateCategoryTypeDTO) => {
      if (!categoryTypeUpdate.id) {
        throw new Error('Cannot update category type without ID');
      }

      await queryClient.cancelQueries({
        queryKey: categoryTypeKeys.detail('category-type', categoryTypeUpdate.id),
      });
      await queryClient.cancelQueries({
        queryKey: categoryTypeKeys.list('category-type'),
      });

      const previousCategoryTypeDetail = queryClient.getQueryData<UpdateCategoryTypeDTO>(
        categoryTypeKeys.detail('category-type', categoryTypeUpdate.id),
      );
      const previousCategoryTypesList = queryClient.getQueryData<ResponseData<UpdateCategoryTypeDTO>>(
        categoryTypeKeys.list('category-type'),
      );

      queryClient.setQueryData(categoryTypeKeys.detail('category-type', categoryTypeUpdate.id), categoryTypeUpdate);

      if (previousCategoryTypesList) {
        queryClient.setQueryData(categoryTypeKeys.list('category-type'), {
          ...previousCategoryTypesList,
          content: previousCategoryTypesList.content.map((categoryType) =>
            categoryType.id === categoryTypeUpdate.id ? categoryTypeUpdate : categoryType,
          ),
        });
      }

      return { previousCategoryTypeDetail, previousCategoryTypesList };
    },

    onSuccess: (updatedCategoryType) => {
      if (updatedCategoryType.data.id) {
        queryClient.setQueryData(
          categoryTypeKeys.detail('category-type', updatedCategoryType.data.id),
          updatedCategoryType,
        );
      }

      queryClient.invalidateQueries({
        queryKey: categoryTypeKeys.list('category-type'),
      });
    },

    onError: (_err, updatedCategoryType, context) => {
      if (context?.previousCategoryTypeDetail) {
        queryClient.setQueryData(
          categoryTypeKeys.detail('category-type', updatedCategoryType.id),
          context.previousCategoryTypeDetail,
        );
      }

      if (context?.previousCategoryTypesList) {
        queryClient.setQueryData(categoryTypeKeys.list('category-type'), context.previousCategoryTypesList);
      }
    },
  });
};
