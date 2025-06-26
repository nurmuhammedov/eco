import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK_INSPECTION } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { inspectionsApi } from '@/features/inspections/model/inspections.model.ts';
import { useSearchParams } from 'react-router-dom';

export function useAttachInspectors() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('inspectionId');
  const intervalId = searchParams.get('intervalId');
  const tin = searchParams.get('tin');

  return useMutation({
    mutationFn: (data: any) => inspectionsApi.attachInspectors({ id, data: { ...data, intervalId, tin } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_INSPECTION] });
      toast.success('SUCCESS!');
    },
  });
}
