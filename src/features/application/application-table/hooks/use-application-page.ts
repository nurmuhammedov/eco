import { ApplicationStatus, ApplicationStatusForInspector } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import { useCustomSearchParams, useTranslatedObject } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';

export const useApplicationPage = () => {
  const { addParams } = useCustomSearchParams();
  const { user } = useAuth();

  const applicationStatusList = useTranslatedObject(ApplicationStatus, 'application_status', false);

  const ApplicationStatusForInspectorList = useTranslatedObject(
    ApplicationStatusForInspector,
    'application_status',
    false,
  );

  const handleChangeTab = (tab: string) => addParams({ status: tab }, 'page');

  return {
    handleChangeTab,
    applicationStatus: user?.role == UserRoles.INSPECTOR ? ApplicationStatusForInspectorList : applicationStatusList,
  };
};
