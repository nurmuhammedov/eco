import { useCustomSearchParams } from '@/shared/hooks';
import { useData } from '@/shared/hooks/api';
import { RiskAnalysisTab } from '../types';

export const useRiskAnalysis = () => {
  const {
    paramsObject: { mode, ...paramsObject },
    addParams,
  } = useCustomSearchParams();

  const { data: hfCount = 0 } = useData<number>('/hf/count', true, { mode });

  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count', true, { mode });

  const { data: irsCount = 0 } = useData<number>('/irs/count', true, { mode });

  const { data: xrayCount = 0 } = useData<number>('/xrays/count', true, { mode });

  const handleChangeTab = (tab: string) => {
    addParams({ mainTab: tab, page: 1 });
  };

  return {
    activeTab: (paramsObject.mainTab as RiskAnalysisTab) || RiskAnalysisTab.XICHO,
    hfCount,
    equipmentsCount,
    irsCount,
    xrayCount,
    handleChangeTab,
  };
};
