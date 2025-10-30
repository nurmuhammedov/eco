import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { useSearchParams } from 'react-router-dom';

export function useSetFiles() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('inspectionId');

  return useMutation({
    mutationFn: (data: any) => inspectionsApi.setFiles({ id, data }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] });
      toast.success('Muvaffaqiyatli saqlandi!');
    },
  });
}
