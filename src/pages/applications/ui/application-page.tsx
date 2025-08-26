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
    if ([UserRoles.LEGAL, UserRoles.INDIVIDUAL]?.includes(user?.role)) {
      return (
        <Button onClick={() => navigate('/applications/create')}>
          <PlusCircle /> Ariza yaratish
        </Button>
      );
    }

    if (UserRoles.INSPECTOR === user?.role) {
      return (
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/applications/create/INSPECTOR')}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 cursor-pointer"
          >
            Норасмий ХИЧО ва қурилма учун ариза яратиш
          </button>
        </div>
      );
    }

    return null;
  }, [user?.role, navigate]);

  return (
    <TabsLayout action={action} activeTab={status} tabs={applicationStatus} onTabChange={handleChangeTab}>
      <ApplicationTable />
    </TabsLayout>
  );
};
export default ApplicationPage;
