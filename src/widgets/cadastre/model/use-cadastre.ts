import { useCustomSearchParams } from '@/shared/hooks';
import { CadastreTab } from '../types';

export const useCadastre = () => {
  const { paramsObject, addParams } = useCustomSearchParams();

  const handleChangeTab = (tab: string) => {
    addParams({ mainTab: tab });
  };

  return {
    activeTab: (paramsObject.mainTab as CadastreTab) || CadastreTab.CADASTRE,
    handleChangeTab,
  };
};
