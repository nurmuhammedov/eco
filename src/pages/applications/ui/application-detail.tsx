// src/pages/applications/ui/application-detail.tsx

import { ApplicationStatus } from '@/entities/application';
import { UserRoles } from '@/entities/user';
import { ApplicationDetail as ApplicationDetailFeature } from '@/features/application/application-detail';
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail.tsx';
import AttachInspectorModal from '@/features/application/application-detail/ui/modals/attach-inspector-modal.tsx';
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal.tsx';
import RejectApplicationModal from '@/features/application/application-detail/ui/modals/reject-application-modal.tsx';
import { GoBack } from '@/shared/components/common';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import RejectAccreditationModal from '@/features/application/application-detail/ui/modals/reject-accreditation-modal.tsx';
import ApplyAccreditationModal from '@/features/application/application-detail/ui/modals/apply-accreditation-modal.tsx';

const ApplicationDetailPage = () => {
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
          {user?.role === UserRoles.HEAD && data?.status === ApplicationStatus.IN_APPROVAL && (
            <>
              <ApplyAccreditationModal />
              <RejectAccreditationModal />
            </>
          )}
        </div>
      </div>
      <ApplicationDetailFeature data={data} userRole={user?.role} />
    </div>
  );
};
export default ApplicationDetailPage;
