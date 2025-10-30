import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK_CHECKLIST } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts';
import { useSearchParams } from 'react-router-dom';

export function useAddChecklist() {
  const [searchParams] = useSearchParams();
  const objectId = searchParams.get('id');
  const intervalId = searchParams.get('intervalId');

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) =>
      await riskAnalysisDetailApi.addCheckList({
        ...data,
        intervalId: Number(intervalId),
        objectId,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_CHECKLIST] });
      toast.success('Muvaffaqiyatli saqlandi!');
    },
  });
}
