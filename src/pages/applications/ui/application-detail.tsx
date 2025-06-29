// src/pages/applications/ui/application-detail.tsx

import { ApplicationStatus } from '@/entities/application';
import { ApplicationTypeEnum } from '@/entities/create-application';
import { UserRoles } from '@/entities/user';
import { ApplicationDetail as ApplicationDetailFeature } from '@/features/application/application-detail';
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail.tsx';
import ExecuteAttestationModal from '@/features/application/application-detail/ui/modals/AttachInspectorForAttestation';
import ManagerAttestationModal from '@/features/application/application-detail/ui/modals/ManagerAttestationModal';
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal';
import RejectApplicationModal from '@/features/application/application-detail/ui/modals/reject-application-modal.tsx';
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal';
import { GoBack } from '@/shared/components/common';
import { useAuth } from '@/shared/hooks/use-auth.ts';

const ApplicationDetailPage = () => {
  const { data } = useApplicationDetail();
  const { user } = useAuth();

  const isAttestationAppeal =
    data?.appealType === ApplicationTypeEnum.ATTESTATION_COMMITTEE ||
    data?.appealType === ApplicationTypeEnum.ATTESTATION_REGIONAL;

  return (
    <div>
      <div className="flex justify-between items-center">
        <GoBack title={`Ariza raqami: ${data?.number || ''}`} />
        <div className="flex gap-2">
          {user?.role === UserRoles.REGIONAL && data?.status === ApplicationStatus.NEW && (
            <>
              {isAttestationAppeal ? <ExecuteAttestationModal /> : <AttachInspectorModal />}
              <RejectApplicationModal />
            </>
          )}
          {user?.role === UserRoles.MANAGER && data?.status === ApplicationStatus.NEW && isAttestationAppeal && (
            <>
              <ManagerAttestationModal />
              <RejectApplicationModal />
            </>
          )}
          {user?.role === UserRoles.INSPECTOR && data?.status === ApplicationStatus.IN_PROCESS && (
            <ReferenceCreateModal />
          )}
        </div>
      </div>
      <ApplicationDetailFeature data={data} userRole={user?.role} />
    </div>
  );
};
// @ts-ignore
export default ApplicationDetailPage;
