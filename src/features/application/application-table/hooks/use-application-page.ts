import { ApplicationStatus } from '@/entities/application';
import { useCustomSearchParams, useTranslatedObject } from '@/shared/hooks';

export const useApplicationPage = () => {
  const { addParams } = useCustomSearchParams();

  const applicationStatus = useTranslatedObject(ApplicationStatus, 'application_status', false);

  const handleChangeTab = (tab: string) => addParams({ status: tab }, 'page');

  return {
    handleChangeTab,
    applicationStatus,
  };
};
