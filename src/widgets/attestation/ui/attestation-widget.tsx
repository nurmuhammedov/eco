import { UserRoles } from '@/entities/user';
import { AttestationList } from '@/features/attestation/ui/attestation-list';
import { PendingList } from '@/features/attestation/ui/pending-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useCustomSearchParams } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';

export const AttestationWidget = () => {
  const { user } = useAuth();
  const {
    paramsObject: { activeTab = 'pending' },
    addParams,
  } = useCustomSearchParams();

  const isManagerOrInspector = user?.role === UserRoles.MANAGER || user?.role === UserRoles.INSPECTOR;

  if (isManagerOrInspector) {
    return (
      <>
        <Tabs value={activeTab} onValueChange={(activeTab) => addParams({ activeTab })}>
          <TabsList className="mb-2">
            <TabsTrigger value="pending">Attestatsiyadan o‘tmagan</TabsTrigger>
            <TabsTrigger value="passed">Attestatsiyadan o‘tgan</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <PendingList />
          </TabsContent>
          <TabsContent value="passed">
            <AttestationList />
          </TabsContent>
        </Tabs>
      </>
    );
  }

  return <AttestationList />;
};
