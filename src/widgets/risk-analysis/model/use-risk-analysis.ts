import { useCustomSearchParams } from '@/shared/hooks';
import { RiskAnalysisTab } from '../types';

export const useRiskAnalysis = () => {
  const { paramsObject, addParams } = useCustomSearchParams();

  const handleChangeTab = (tab: string) => {
    addParams({ mainTab: tab });
  };

  return {
    activeTab: (paramsObject.mainTab as RiskAnalysisTab) || RiskAnalysisTab.XICHO,
    handleChangeTab,
  };
};
