import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createApplicationsAPI } from '@/entities/create-application';

export const useCreateHPOApplicationMutations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplicationsAPI.createHPOApplication,
    onSuccess: (createdData) => {
      queryClient.invalidateQueries({
        queryKey: ['create-hpo-application'],
      });

      queryClient.setQueryData(['create-hpo-application'], createdData);
    },
  });
};

export const useCreateCraneApplicationMutations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplicationsAPI.createCraneApplication,
    onSuccess: (createdData) => {
      queryClient.invalidateQueries({
        queryKey: ['create-crane-application'],
      });

      queryClient.setQueryData(['create-crane-application'], createdData);
    },
  });
};
