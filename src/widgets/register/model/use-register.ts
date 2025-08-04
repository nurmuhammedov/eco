// src/widgets/register/model/use-register.ts
import { UserRoles } from '@/entities/user';
import { useCustomSearchParams, useData } from '@/shared/hooks/api';
import { useAuth } from '@/shared/hooks/use-auth';
import { useCallback, useMemo } from 'react';
import { RegisterActiveTab } from '../types';

export const useRegister = () => {
  const { paramsObject, addParams } = useCustomSearchParams();
  const { user } = useAuth();

  const { data: hfCount = 0 } = useData<number>('/hf/count');

  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count');

  const { data: irsCount = 0 } = useData<number>('/irs/count');

  const activeTab = useMemo<RegisterActiveTab>(() => {
    const tabFromParams = paramsObject['tab'] as string;
    if (Object.values(RegisterActiveTab).includes(tabFromParams as RegisterActiveTab)) {
      return tabFromParams as RegisterActiveTab;
    }
    return user?.role == UserRoles.INDIVIDUAL ? RegisterActiveTab.EQUIPMENTS : RegisterActiveTab.HF;
  }, [paramsObject, user?.role]);

  const handleChangeTab = useCallback(
    (tabValue: string) => {
      if (Object.values(RegisterActiveTab).includes(tabValue as RegisterActiveTab)) {
        addParams({ tab: tabValue }, 'page', 'search', 'startDate', 'endDate');
      } else {
        console.warn(`Invalid tab value: ${tabValue}, defaulting to HF.`);
        addParams({ tab: RegisterActiveTab.HF }, 'page', 'search', 'startDate', 'endDate');
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
