import { ApplicationDetail } from '@/features/application/application-detail';
import { GoBack } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button.tsx';
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail.tsx';
import AttachInspectorModal from '@/features/application/application-detail/ui/modals/attach-inspector-modal.tsx';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import { ApplicationStatus } from '@/entities/application';
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal.tsx';

const ApplicationPage = () => {
  const { data } = useApplicationDetail();
  const { user } = useAuth();
  console.log(data);
  return (
    <div>
      <div className="flex justify-between items-center">
        <GoBack title={`Ariza raqami: ${data?.number || ''}`} />
        <div className="flex gap-2">
          {user?.role === UserRoles.REGIONAL && data?.status === ApplicationStatus.NEW && (
            <>
              <AttachInspectorModal />
              <Button variant="destructive">Arizani qaytarish</Button>
            </>
          )}
          {user?.role === UserRoles.INSPECTOR && data?.status === ApplicationStatus.IN_PROCESS && (
            <ReferenceCreateModal />
          )}
        </div>
      </div>
      <ApplicationDetail data={data} />
    </div>
  );
};
export default ApplicationPage;
