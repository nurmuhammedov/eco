import { ApplicationStatus, ApplicationStatusForInspector } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import { useCustomSearchParams, useData, useTranslatedObject } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { useMemo } from 'react';

export const useApplicationPage = () => {
  const { addParams } = useCustomSearchParams();
  const { user } = useAuth();
  const userRole = user?.role;

  const { data: inspectorInProcessCount = 0 } = useData<number>('/appeals/count', userRole === UserRoles.INSPECTOR, {
    status: ApplicationStatus.IN_PROCESS,
  });

  const { data: regionalNewCount = 0 } = useData<number>('/appeals/count', userRole === UserRoles.REGIONAL, {
    status: ApplicationStatus.NEW,
  });

  const { data: regionalAgreementCount = 0 } = useData<number>('/appeals/count', userRole === UserRoles.REGIONAL, {
    status: ApplicationStatus.IN_AGREEMENT,
  });

  const { data: managerApprovalCount = 0 } = useData<number>('/appeals/count', userRole === UserRoles.MANAGER, {
    status: ApplicationStatus.IN_APPROVAL,
  });

  const applicationStatusList = useTranslatedObject(ApplicationStatus, 'application_status', false);

  const ApplicationStatusForInspectorList = useTranslatedObject(
    ApplicationStatusForInspector,
    'application_status',
    false,
  );

  const handleChangeTab = (tab: string) => addParams({ status: tab }, 'page');

  const applicationStatus = useMemo(() => {
    const baseList = userRole === UserRoles.INSPECTOR ? ApplicationStatusForInspectorList : applicationStatusList;

    return baseList.map((status) => {
      let count = 0;
      switch (status.id) {
        case ApplicationStatus.IN_PROCESS:
          if (userRole === UserRoles.INSPECTOR) count = inspectorInProcessCount;
          break;
        case ApplicationStatus.NEW:
          if (userRole === UserRoles.REGIONAL) count = regionalNewCount;
          break;
        case ApplicationStatus.IN_AGREEMENT:
          if (userRole === UserRoles.REGIONAL) count = regionalAgreementCount;
          break;
        case ApplicationStatus.IN_APPROVAL:
          if (userRole === UserRoles.MANAGER) count = managerApprovalCount;
          break;
      }
      return { ...status, count };
    });
  }, [
    userRole,
    applicationStatusList,
    ApplicationStatusForInspectorList,
    inspectorInProcessCount,
    regionalNewCount,
    regionalAgreementCount,
    managerApprovalCount,
  ]);

  return {
    handleChangeTab,
    applicationStatus,
  };
};
