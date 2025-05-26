import { ApplicationStatus } from '@/entities/application';
import { PERMISSIONS } from '@/entities/permission';
import { ApplicationTable } from '@/features/application/application-table';
import { useApplicationPage } from '@/features/application/application-table/hooks';
import { Button } from '@/shared/components/ui/button';
import { useCustomSearchParams, useHasPermission } from '@/shared/hooks';
import { TabsLayout } from '@/shared/layouts';
import { PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationPage = () => {
  const navigate = useNavigate();
  const { handleChangeTab, applicationStatus } = useApplicationPage();
  const {
    paramsObject: { status = ApplicationStatus.ALL },
  } = useCustomSearchParams();
  const canCreateApplication = useHasPermission(PERMISSIONS.APPEAL);

  const action = useMemo(() => {
    return (
      canCreateApplication && (
        <Button onClick={() => navigate('/applications/create')}>
          <PlusCircle /> Ariza yaratish
        </Button>
      )
    );
  }, [canCreateApplication]);

  return (
    <TabsLayout action={action} activeTab={status} tabs={applicationStatus} onTabChange={handleChangeTab}>
      <ApplicationTable />
    </TabsLayout>
  );
};
export default ApplicationPage;
