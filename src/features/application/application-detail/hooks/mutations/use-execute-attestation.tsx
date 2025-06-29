// src/features/application/application-detail/hooks/mutations/use-execute-attestation.tsx

import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useExecuteAttestation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationDetailApi.executeAttestation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
      toast.success('Muvaffaqiyatli ijroga olindi!');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ijroga olishda noma'lum xatolik");
    },
  });
}
