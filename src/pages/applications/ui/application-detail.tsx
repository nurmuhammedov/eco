import { ApplicationStatus } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import { ApplicationDetail } from '@/features/application/application-detail';
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail.tsx';
import AttachInspectorModal from '@/features/application/application-detail/ui/modals/attach-inspector-modal.tsx';
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal.tsx';
import RejectApplicationModal from '@/features/application/application-detail/ui/modals/reject-application-modal.tsx';
import { GoBack } from '@/shared/components/common';
import { useAuth } from '@/shared/hooks/use-auth.ts';

const ApplicationPage = () => {
  const { data } = useApplicationDetail();
  const { user } = useAuth();
  return (
    <div>
      <div className="flex justify-between items-center">
        <GoBack title={`Ariza raqami: ${data?.number || ''}`} />
        <div className="flex gap-2">
          {user?.role === UserRoles.REGIONAL && data?.status === ApplicationStatus.NEW && (
            <>
              <AttachInspectorModal />
              <RejectApplicationModal />
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
