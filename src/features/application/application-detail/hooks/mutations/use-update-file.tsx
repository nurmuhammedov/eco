// src/features/application/application-detail/hooks/mutations/use-update-file.tsx

import { applicationDetailApi } from '@/features/application/application-detail/model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdateApplicationFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { appealId?: string; fieldName: string; filePath: string }) =>
      applicationDetailApi.uploadFile(payload),
    onSuccess: async () => {
      toast.success('Success');
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Faylni yangilashda nomaʼlum xatolik');
    },
  });
}
