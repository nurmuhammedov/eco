import { UserRoles } from '@/entities/user'
import { getAppealPermissions } from '@/features/application/application-detail/model/appeal-permissions'
import { ApplicationDetail as ApplicationDetailFeature } from '@/features/application/application-detail'
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail.tsx'
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal'
import RejectApplicationModal from '@/features/application/application-detail/ui/modals/reject-application-modal.tsx'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import AttachInspectorModal from '@/features/application/application-detail/ui/modals/attach-inspector-modal.tsx'
import ApplicationLogsModal from '@/features/application/application-detail/ui/modals/application-logs-modal.tsx'
import { AccreditationAppealActions } from '@/features/application/application-detail/ui/parts/accreditation-appeal-actions.tsx'

const ApplicationDetailPage = ({ showAttestationActions }: { showAttestationActions?: boolean }) => {
  const { data } = useApplicationDetail()
  const { user } = useAuth()

  const { isAccreditation, canAssign, canReject, canExecute } = getAppealPermissions(
    user?.role,
    data?.appealType,
    data?.status
  )

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <GoBack title={`Ariza raqami: ${data?.number || ''}`} />
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {isAccreditation && user?.role === UserRoles.MANAGER && (
            <AccreditationAppealActions appealId={data?.id} status={data?.status} />
          )}
          {canAssign && <AttachInspectorModal />}
          {canReject && <RejectApplicationModal />}
          {canExecute && <ReferenceCreateModal />}
          <ApplicationLogsModal />
        </div>
      </div>
      <ApplicationDetailFeature data={data} userRole={user?.role} showAttestationActions={showAttestationActions} />
    </>
  )
}
export default ApplicationDetailPage
