import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts';
import { useSearchParams } from 'react-router-dom';

export function useRejectRiskItem() {
  const [searchParams] = useSearchParams();
  const tin = searchParams.get('tin');
  const id = searchParams.get('id');

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, data }: { type: any, data: any }) => await riskAnalysisDetailApi.rejectRiskItem({
      type,
      data:[ {
        ...data,
        tin,
        hazardousFacilityId: id,
        indicatorType: 'PARAGRAPH_HF_1'

      }]
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_APPLICATIONS] });
      toast.success('SUCCESS!');
    }
  });
}