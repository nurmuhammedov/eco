import { ApplicationStatus } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import { ApplicationTable } from '@/features/application/application-table';
import { useApplicationPage } from '@/features/application/application-table/hooks';
import { Button } from '@/shared/components/ui/button';
import { useCustomSearchParams } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { TabsLayout } from '@/shared/layouts';
import { PlusCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ApplicationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { handleChangeTab, applicationStatus } = useApplicationPage();
  const {
    paramsObject: { status = ApplicationStatus.ALL },
  } = useCustomSearchParams();

  const action = useMemo(() => {
    return (
      [UserRoles.LEGAL, UserRoles.INDIVIDUAL]?.includes(user?.role) && (
        <Button onClick={() => navigate('/applications/create')}>
          <PlusCircle /> Ariza yaratish
        </Button>
      )
    );
  }, []);

  return (
    <TabsLayout action={action} activeTab={status} tabs={applicationStatus} onTabChange={handleChangeTab}>
      <ApplicationTable />
    </TabsLayout>
  );
};
export default ApplicationPage;
