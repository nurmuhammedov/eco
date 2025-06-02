// src/widgets/register/model/use-register.ts
import { useCustomSearchParams } from '@/shared/hooks/api';
import { useCallback, useMemo } from 'react';
import { RegisterActiveTab } from '../types';

export const useRegister = () => {
  const { paramsObject, addParams } = useCustomSearchParams();

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
    handleChangeTab,
  };
};
