import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ConfirmDocumentPayload {
  appealId: any;
  documentId: any;
  shouldRegister?: boolean;
}

export function useConfirmDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ConfirmDocumentPayload) => await applicationDetailApi.confirmDocument(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
      toast.success('Muvaffaqiyatli saqlandi!');
    },
  });
}
