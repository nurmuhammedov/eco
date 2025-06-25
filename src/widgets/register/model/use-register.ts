// src/widgets/register/model/use-register.ts
import { useCustomSearchParams, useData } from '@/shared/hooks/api';
import { useCallback, useMemo } from 'react';
import { RegisterActiveTab } from '../types';

export const useRegister = () => {
  const { paramsObject, addParams } = useCustomSearchParams();

  const { data: hfCount = 0 } = useData<number>('/hf/count');

  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count');

  const { data: irsCount = 0 } = useData<number>('/irs/count');

  const activeTab = useMemo<RegisterActiveTab>(() => {
    const tabFromParams = paramsObject['tab'] as string;
    if (Object.values(RegisterActiveTab).includes(tabFromParams as RegisterActiveTab)) {
      return tabFromParams as RegisterActiveTab;
    }
    return RegisterActiveTab.HF;
  }, [paramsObject]);

  const handleChangeTab = useCallback(
    (tabValue: string) => {
      if (Object.values(RegisterActiveTab).includes(tabValue as RegisterActiveTab)) {
        addParams({ tab: tabValue });
      } else {
        console.warn(`Invalid tab value: ${tabValue}, defaulting to HF.`);
        addParams({ tab: RegisterActiveTab.HF });
      }
    },
    [addParams],
  );

  return {
    activeTab,
    hfCount,
    equipmentsCount,
    irsCount,
    handleChangeTab,
  };
};
