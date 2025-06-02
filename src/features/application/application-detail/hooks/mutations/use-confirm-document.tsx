import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

export function useConfirmDocument() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: any) => await applicationDetailApi.confirmDocument({ appealId: id, documentId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
      toast.success('Success');
    }
  });
}