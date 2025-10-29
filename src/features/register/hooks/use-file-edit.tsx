import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

export function useUpdateRegisterFile(url?: string) {
  const queryClient = useQueryClient();
  const { id = '' } = useParams();

  return useMutation({
    mutationFn: (payload: any) => applicationDetailApi.updateFile(id, payload, url),
    onSuccess: async () => {
      toast.success('Muvaffaqiyatli saqlandi!');
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
    },
  });
}
