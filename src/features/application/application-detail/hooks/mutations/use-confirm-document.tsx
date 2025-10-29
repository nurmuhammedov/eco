import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useConfirmDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (documentId: any) => await applicationDetailApi.confirmDocument(documentId),
    onSuccess: async () => {
      toast.success('Success');
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
    },
  });
}
