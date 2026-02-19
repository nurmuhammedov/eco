import { FC } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDetail } from '@/shared/hooks'
import DetailRow from '@/shared/components/common/detail-row'
import { formatDate } from '@/shared/utils/date'
import ChangeLogTable from '@/features/register/register-change-detail/ui/change-log-table.tsx'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { ApplicationStatusRow } from '@/shared/components/common/application-status-row'
import { GoBack } from '@/shared/components/common'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { ApplicationStatus } from '@/entities/application'
import AssignExecutorModal from '@/features/register/register-change-detail/modals/assign-executor-modal'
import UpdateDescriptionModal from '@/features/register/register-change-detail/modals/update-description-modal'
import ConfirmProcessModal from '@/features/register/register-change-detail/modals/confirm-process-modal'
import ApplicationLogsModal from '@/features/application/application-detail/ui/modals/application-logs-modal'

const RegisterChangeDetail: FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>()
  const { user } = useAuth()

  const { detail: changeDetail } = useDetail<any>('/changes/by-belong', id, !!id)

  const changeId = changeDetail?.id
  const isLegal = changeDetail?.ownerIdentity?.toString()?.length === 9
  const status = changeDetail?.status

  const canAssign =
    (user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD) && status === ApplicationStatus.NEW
  const canDescribe =
    (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.MANAGER) && status === ApplicationStatus.IN_PROCESS
  const canAgree =
    (user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD) && status === ApplicationStatus.IN_AGREEMENT
  const canApproveHead =
    (user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD) && status === ApplicationStatus.IN_APPROVAL
  const canApproveManager = user?.role === UserRoles.MANAGER && status === ApplicationStatus.IN_APPROVAL

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
      <div className="flex items-center justify-between">
        <GoBack title="O‘zgartirish so‘rovi" />
        <div className="flex gap-2">
          {canAssign && (
            <>
              <UpdateDescriptionModal desc={changeDetail?.description || '-'} changeId={changeId} />
              <AssignExecutorModal changeId={changeId} />
            </>
          )}
          {/*{(user?.role === UserRoles.INSPECTOR ||*/}
          {/*  user?.role === UserRoles.MANAGER ||*/}
          {/*  user?.role === UserRoles.HEAD ||*/}
          {/*  user?.role === UserRoles.REGIONAL) &&*/}
          {/*  (status === ApplicationStatus.IN_PROCESS ||*/}
          {/*    status === ApplicationStatus.IN_APPROVAL ||*/}
          {/*    status === ApplicationStatus.IN_AGREEMENT) && (*/}
          {/*  )}*/}
          {canDescribe && (
            <>
              <UpdateDescriptionModal desc={changeDetail?.description || '-'} changeId={changeId} />
              <ConfirmProcessModal changeId={changeId} title="Tasdiqlansinmi" buttonText="Tasdiqlash" />
            </>
          )}
          {canAgree && (
            <>
              <UpdateDescriptionModal desc={changeDetail?.description || '-'} changeId={changeId} />
              <ConfirmProcessModal changeId={changeId} title="Kelishilsinmi" buttonText="Kelishish" />
            </>
          )}
          {(canApproveHead || canApproveManager) && (
            <>
              <UpdateDescriptionModal desc={changeDetail?.description || '-'} changeId={changeId} />
              <ConfirmProcessModal changeId={changeId} title="Tasdiqlansinmi" buttonText="Tasdiqlash" />
            </>
          )}
          <ApplicationLogsModal id={changeId} type="change" />
        </div>
      </div>

      <DetailCardAccordion defaultValue={['general', 'applicant', 'logs']}>
        <DetailCardAccordion.Item value="general" title="So‘rov va ijro to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow
              title="Reyestr ma’lumotlari:"
              value={
                <Link className="text-[#0271FF]" to={`/register/${id}/${type}`}>
                  Ko‘rish
                </Link>
              }
            />
            <DetailRow title="So‘rov sanasi:" value={formatDate(changeDetail?.createdAt)} />
            <ApplicationStatusRow status={changeDetail?.status} title="So‘rov holati:" />
            <DetailRow title="Ijrochi ma‘sul F.I.SH.:" value={changeDetail?.executorName || '-'} />
            <div className="grid grid-cols-2 content-center items-center gap-1 rounded-lg px-2.5 py-2 odd:bg-neutral-50">
              <h2 className="text-normal font-normal text-gray-700">Izoh:</h2>
              <p
                className="text-normal font-normal whitespace-pre-wrap text-gray-900"
                dangerouslySetInnerHTML={{ __html: changeDetail?.description || '-' }}
              />
            </div>
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="applicant" title="Arizachi to‘g‘risida ma’lumot">
          {isLegal ? (
            <LegalApplicantInfo tinNumber={changeDetail?.ownerIdentity} />
          ) : (
            <div className="flex flex-col py-1">
              <DetailRow title="Arizachi JSHIR:" value={changeDetail?.ownerIdentity || '-'} />
              <DetailRow title="Arizachi F.I.SH.:" value={changeDetail?.directorName || '-'} />
              <DetailRow title="Arizachining manzili:" value={changeDetail?.address || '-'} />
            </div>
          )}
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="logs" title="O‘zgartirishlar ro‘yxati">
          <div className="py-2">
            <ChangeLogTable changeId={changeId} />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default RegisterChangeDetail
