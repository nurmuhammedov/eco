import { ApplicationStatus } from '@/entities/application'
import { ApplicationTypeEnum } from '@/entities/create-application'
import { UserRoles } from '@/entities/user'
import { ApplicationDetail as ApplicationDetailFeature } from '@/features/application/application-detail'
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail.tsx'
import ReferenceCreateModal from '@/features/application/application-detail/ui/modals/reference-create-modal'
import RejectApplicationModal from '@/features/application/application-detail/ui/modals/reject-application-modal.tsx'
import { GoBack } from '@/shared/components/common'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import AttachInspectorModal from '@/features/application/application-detail/ui/modals/attach-inspector-modal.tsx'
import ApplicationLogsModal from '@/features/application/application-detail/ui/modals/application-logs-modal.tsx'

const ApplicationDetailPage = ({ showAttestationActions }: { showAttestationActions?: boolean }) => {
  const { data } = useApplicationDetail()
  const { user } = useAuth()

  const isXrayAppeal = data?.appealType === ApplicationTypeEnum.REGISTER_XRAY

  return (
    <>
      <div className="flex items-center justify-between">
        <GoBack title={`Ariza raqami: ${data?.number || ''}`} />
        <div className={'mr-2 ml-auto'}>
          <ApplicationLogsModal />
        </div>
        <div className="flex gap-2">
          {(user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD) &&
            data?.status === ApplicationStatus.NEW && (
              <>
                <AttachInspectorModal />
                <RejectApplicationModal />
              </>
            )}
          {user?.role === UserRoles.INSPECTOR && data?.status === ApplicationStatus.IN_PROCESS && (
            <ReferenceCreateModal />
          )}
          {user?.role === UserRoles.MANAGER && data?.status === ApplicationStatus.IN_PROCESS && isXrayAppeal && (
            <>
              <ReferenceCreateModal />
            </>
          )}
        </div>
      </div>
      <ApplicationDetailFeature data={data} userRole={user?.role} showAttestationActions={showAttestationActions} />
    </>
  )
}
export default ApplicationDetailPage
