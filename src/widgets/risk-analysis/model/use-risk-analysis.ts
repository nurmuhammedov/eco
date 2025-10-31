import { useCustomSearchParams } from '@/shared/hooks';
import { useData } from '@/shared/hooks/api';
import { RiskAnalysisTab } from '../types';

export const useRiskAnalysis = () => {
  const {
    paramsObject: { mode, ...paramsObject },
  } = useCustomSearchParams();

  const { data: hfCount = 0 } = useData<number>('/hf/count', true, { mode });

  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count', true, { mode });

  const { data: irsCount = 0 } = useData<number>('/irs/count', true, { mode });

  const { data: xrayCount = 0 } = useData<number>('/xrays/count', true, { mode });

  return {
    activeTab: (paramsObject.mainTab as RiskAnalysisTab) || RiskAnalysisTab.XICHO,
    hfCount,
    equipmentsCount,
    irsCount,
    xrayCount,
  };
};
