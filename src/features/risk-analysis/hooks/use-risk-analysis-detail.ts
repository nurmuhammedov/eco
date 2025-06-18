import { useQuery } from '@tanstack/react-query';
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys.ts';

export const useRiskAnalysisDetail = () => {
  const [searchParams] = useSearchParams();
  const tin = searchParams.get('tin');
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const intervalId = searchParams.get('intervalId');
  const navigate = useNavigate();

  if (!intervalId || !id || !tin) {
    navigate('/risk-analysis', { replace: true });
  }
  return useQuery({
    queryKey: [QK_RISK_ANALYSIS, intervalId, id, tin, type],
    queryFn: () =>
      riskAnalysisDetailApi.getRiskItems(
        {
          intervalId,
          id,
          tin,
        },
        type,
      ),
  });
};
