import { useCustomSearchParams } from '@/shared/hooks';
import { RiskAnalysisTab } from '../types';

export const useRiskAnalysis = () => {
  const { paramsObject, addParams } = useCustomSearchParams();

  const handleChangeTab = (tab: string) => {
    addParams({ mainTab: tab, page: 1 });
  };

  return {
    activeTab: (paramsObject.mainTab as RiskAnalysisTab) || RiskAnalysisTab.XICHO,
    handleChangeTab,
  };
};
