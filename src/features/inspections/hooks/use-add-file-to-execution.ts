import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';

export function useAddFileToExecution(id: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => inspectionsApi.addFileToInspectionReport({ id, data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] });
      toast.success('Muvaffaqiyatli saqlandi!');
    },
  });
}
