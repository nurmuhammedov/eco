import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

export function useUpdateRegisterFile() {
  const queryClient = useQueryClient();
  const { id = '' } = useParams();

  return useMutation({
    mutationFn: (payload: any) => applicationDetailApi.updateFile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
      toast.success('Success');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Faylni yangilashda noma'lum xatolik");
    },
  });
}
