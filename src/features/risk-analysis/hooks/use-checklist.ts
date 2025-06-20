import { useQuery } from '@tanstack/react-query';
import { QK_CHECKLIST } from '@/shared/constants/query-keys.ts';
import { useSearchParams } from 'react-router-dom';
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts';

export const useChecklist = () => {
  const [searchParams] = useSearchParams();
  const intervalId = searchParams.get('intervalId') || '';
  const objectId = searchParams.get('id') || '';
  const tin = searchParams.get('tin') || '';

  return useQuery({
    queryKey: [QK_CHECKLIST, intervalId, objectId, tin],
    queryFn: () => riskAnalysisDetailApi.getChecklist({ intervalId, objectId, tin }),
  });
};
