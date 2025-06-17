import { useQuery } from '@tanstack/react-query';
import { riskAnalysisIntervalsAPI } from '../queries/risk-analysis-intervals.api';

export const useRiskAnalysisIntervalsQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['risk-analysis-intervals-select'],
    queryFn: riskAnalysisIntervalsAPI.list,
    enabled,
  });
};
