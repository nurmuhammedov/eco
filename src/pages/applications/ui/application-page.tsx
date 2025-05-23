import { useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { TabsLayout } from '@/shared/layouts';
import { useHasPermission } from '@/shared/hooks';
import { PERMISSIONS } from '@/entities/permission';
import { Button } from '@/shared/components/ui/button';
import { useApplicationPage } from '@/pages/applications';
import { ApplicationTable } from '@/features/application-table';
import { ApplicationFilters } from '@/features/application-filters';
import { useNavigate } from 'react-router-dom';

const ApplicationPage = () => {
  const navigate = useNavigate();
  const { setFilters, activeTab, handleChangeTab, applicationStatus } = useApplicationPage();

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
    <TabsLayout action={action} activeTab={activeTab} tabs={applicationStatus} onTabChange={handleChangeTab}>
      <ApplicationFilters onFilter={setFilters} />
      <ApplicationTable />
    </TabsLayout>
  );
};
export default ApplicationPage;
