import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys.ts';
import { toast } from 'sonner';
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts';
import { useSearchParams } from 'react-router-dom';

export const idNames = new Map([
  ['hf', 'hazardousFacilityId'],
  ['irs', 'irsId'],
  ['elevator', 'equipmentId'],
  ['attraction', 'equipmentId'],
]);

export function useRejectRiskItem() {
  const [searchParams] = useSearchParams();
  const tin = Number(searchParams.get('tin'));
  const id = searchParams.get('id');
  const intervalId = Number(searchParams.get('intervalId'));
  const currentType = searchParams.get('type') || 'equipmentId';
  const currentIdName = idNames.get(currentType);

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, data }: { type: any; data: any }) =>
      await riskAnalysisDetailApi.rejectRiskItem({
        type,
        data: [
          {
            ...data,
            tin,
            intervalId,
            [currentIdName as string]: id,
          },
        ],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QK_RISK_ANALYSIS] });
      toast.success('SUCCESS!');
    },
  });
}
