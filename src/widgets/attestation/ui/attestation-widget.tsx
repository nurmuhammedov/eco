import { UserRoles } from '@/entities/user';
import { AttestationList } from '@/features/attestation/ui/attestation-list';
import { PendingList } from '@/features/attestation/ui/pending-list';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useCustomSearchParams } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AttestationWidget = () => {
  const { user } = useAuth();
  const {
    paramsObject: { activeTab = 'pending' },
    addParams,
  } = useCustomSearchParams();
  const navigate = useNavigate();

  const canAddEmployee = user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL;
  const handleAddEmployeeClick = () => {
    navigate('/attestations/add');
  };

  const isManagerOrInspector = user?.role === UserRoles.MANAGER || user?.role === UserRoles.INSPECTOR;

  if (isManagerOrInspector) {
    return (
      <>
        <h2 className="text-2xl font-bold mb-4">Attestatsiya</h2>

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Attestatsiya</h1>
        {canAddEmployee && (
          <Button onClick={handleAddEmployeeClick}>
            <PlusCircle className="mr-2 h-4 w-4" /> Xodim qo‘shish
          </Button>
        )}
      </div>
      <AttestationList />
    </div>
  );
};
