import { UserRoles } from '@/entities/user'
import { getAppealPermissions } from '@/features/application/application-detail/model/appeal-permissions'
import { ApplicationDetail as ApplicationDetailFeature } from '@/features/application/application-detail'
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail'
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal'
import RejectApplicationModal from '@/features/application/application-detail/ui/modals/reject-application-modal'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth'
import AttachInspectorModal from '@/features/application/application-detail/ui/modals/attach-inspector-modal'
import ApplicationLogsModal from '@/features/application/application-detail/ui/modals/application-logs-modal'
import { AccreditationAppealActions } from '@/features/application/application-detail/ui/parts/accreditation-appeal-actions'
import { AppealDetailSkeleton } from '@/features/application/application-detail/ui/parts/appeal-detail-skeleton'

const ApplicationDetailPage = ({ showAttestationActions }: { showAttestationActions?: boolean }) => {
  const { data, isLoading } = useApplicationDetail()
  const { user } = useAuth()

  const { isAccreditation, canAssign, canReject, canExecute } = getAppealPermissions(
    user?.role,
    data?.appealType,
    data?.status
  )

  if (isLoading) return <AppealDetailSkeleton />

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
