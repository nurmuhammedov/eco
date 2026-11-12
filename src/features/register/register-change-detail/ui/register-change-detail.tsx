import { SafeHtml } from '@/shared/components/common/safe-html'
import { isRestoreChange, type RegistryChange } from '@/entities/registry'
import { FC } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useDetail } from '@/shared/hooks'
import DetailRow from '@/shared/components/common/detail-row'
import { formatDate } from '@/shared/utils/date'
import ChangeLogTable from '@/features/register/register-change-detail/ui/change-log-table'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'
import { ApplicationStatusRow } from '@/entities/application/ui/application-status-row'
import { GoBack } from '@/shared/components/common'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { ApplicationStatus } from '@/entities/application'
import AssignExecutorModal from '@/features/register/register-change-detail/modals/assign-executor-modal'
import ReturnChangeModal from '@/features/register/register-change-detail/modals/return-change-modal'
import ConfirmProcessModal from '@/features/register/register-change-detail/modals/confirm-process-modal'
import ApplicationLogsModal from '@/features/application/application-detail/ui/modals/application-logs-modal'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { RestoreModal } from '@/features/register/common/ui/restore-modal'

/** The register sections this page knows how to read a change request for. */
const SECTIONS = ['hf', 'equipments', 'irs', 'xrays', 'xray', 'radiation-profiles']

/** A restore request goes straight to the committee: no NEW or IN_AGREEMENT stage */
const RESTORE_STEPS = [ApplicationStatus.IN_APPROVAL, ApplicationStatus.COMPLETED]

const RegisterChangeDetail: FC = () => {
  const params = useParams<{ id: string; type: string }>()

  /**
   * The address used to read `change/:id/:type`. Both segments are free text, so
   * a redirect cannot tell the two shapes apart - only the section name can, and
   * it is the one segment with a known set of values.
   */
  const swapped = !!params.type && !SECTIONS.includes(params.type) && SECTIONS.includes(params.id ?? '')
  const id = swapped ? params.type : params.id
  const type = swapped ? params.id : params.type

  const { user } = useAuth()

  const { detail: changeDetail, isLoading = true } = useDetail<RegistryChange>('/changes/by-belong', id, !!id)

  const changeId = changeDetail?.id
  const isLegal = changeDetail?.ownerIdentity?.toString()?.length === 9
  const status = changeDetail?.status
  const isDeregister = changeDetail?.belongType?.startsWith('DEREGISTER')
  const isStatusChange =
    changeDetail?.belongType?.startsWith('CHANGE_EQP_STATUS') ||
    changeDetail?.belongType?.startsWith('CHANGE_HF_STATUS')
  const isRestore = isRestoreChange(changeDetail?.belongType)

  const isHfType = type === 'equipments' || type === 'hf'
  const isIrsType = type === 'radiation-profiles' || type === 'irs' || type === 'xrays' || type === 'xray'

  const canAssign =
    !isRestore &&
    status === ApplicationStatus.NEW &&
    ((isHfType && (user?.role === UserRoles.REGIONAL || user?.isSupervisor)) ||
      (isIrsType && user?.role === UserRoles.HEAD))

  const canDescribe =
    !isRestore &&
    status === ApplicationStatus.IN_PROCESS &&
    ((isHfType && (user?.role === UserRoles.INSPECTOR || user?.isController)) ||
      (isIrsType && user?.role === UserRoles.MANAGER))

  // A restore request skips the regional agreement: only MANAGER confirms or returns it, at IN_APPROVAL
  const canAgree =
    (!isRestore &&
      status === ApplicationStatus.IN_AGREEMENT &&
      isHfType &&
      (user?.role === UserRoles.REGIONAL || user?.isSupervisor)) ||
    (status === ApplicationStatus.IN_APPROVAL &&
      ((isIrsType && !isRestore && user?.role === UserRoles.HEAD) || (isHfType && user?.role === UserRoles.MANAGER)))

  const canReturn =
    (!isRestore &&
      status === ApplicationStatus.IN_AGREEMENT &&
      isHfType &&
      (user?.role === UserRoles.REGIONAL || user?.isSupervisor)) ||
    (status === ApplicationStatus.IN_APPROVAL &&
      ((isIrsType && !isRestore && user?.role === UserRoles.HEAD) || (isHfType && user?.role === UserRoles.MANAGER)))

  // A returned restore request is fixed and sent again by its sender (a supervisor is a REGIONAL here).
  // The backend refuses a REGIONAL another region's object; a supervisor's scope is left to the backend.
  const canResend =
    isRestore &&
    isHfType &&
    status === ApplicationStatus.IN_PROCESS &&
    user?.role === UserRoles.REGIONAL &&
    (!!user?.isSupervisor || Number(changeDetail?.regionId) === user?.regionId)
  const isRestoreAwaitingManager =
    isRestore && status === ApplicationStatus.IN_APPROVAL && user?.role === UserRoles.REGIONAL

  if (isLoading) return <DetailPageSkeleton />

  const isControllerOrSupervisor = user?.isController || user?.isSupervisor
  const cannotExecute = isControllerOrSupervisor && !isHfType

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center justify-between">
        <GoBack
          title={
            isDeregister
              ? 'Reyestrdan chiqarish uchun so‘rov'
              : isStatusChange
                ? 'Holatini o‘zgartirish uchun so‘rov'
                : isRestore
                  ? 'Reyestrga qaytarish uchun so‘rov'
                  : 'Ma’lumotlarni o‘zgartirish uchun so‘rov'
          }
        />
        <div className="flex gap-2">
          {!cannotExecute && changeId && (
            <>
              {canReturn && <ReturnChangeModal changeId={changeId} />}
              {canAssign && (
                <>
                  <AssignExecutorModal changeId={changeId} />
                </>
              )}
              {canDescribe && (
                <>
                  <ConfirmProcessModal changeId={changeId} title="Tasdiqlansinmi" buttonText="Tasdiqlash" />
                </>
              )}
              {canAgree && (
                <>
                  <ConfirmProcessModal
                    changeId={changeId}
                    title={status === ApplicationStatus.IN_APPROVAL ? 'Tasdiqlansinmi' : 'Kelishilsinmi'}
                    buttonText={status === ApplicationStatus.IN_APPROVAL ? 'Tasdiqlash' : 'Kelishish'}
                  />
                </>
              )}
              {canResend && <RestoreModal endpoint={`/${type}/${id}/restore`} buttonText="Qayta yuborish" isResubmit />}
              {isRestoreAwaitingManager && (
                <Badge variant="info" className="py-2">
                  Tasdiqlashda
                </Badge>
              )}
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
                <Link
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#0271FF] hover:underline"
                  to={type === 'radiation-profiles' ? `/register/radiation-profiles/${id}` : `/register/${type}/${id}`}
                >
                  Ko‘rish
                  <ArrowUpRight className="size-4" />
                </Link>
              }
            />
            {isRestore && status === ApplicationStatus.IN_PROCESS ? (
              <DetailRow
                title="So‘rov holati:"
                value={
                  <Badge variant="warning" className="py-1">
                    Qaytarilgan (tuzatish uchun)
                  </Badge>
                }
              />
            ) : (
              <ApplicationStatusRow
                status={changeDetail?.status}
                title="So‘rov holati:"
                steps={isRestore ? RESTORE_STEPS : undefined}
              />
            )}
            <DetailRow title="So‘rov sanasi:" value={formatDate(changeDetail?.createdAt)} />
            <DetailRow
              title="So‘rov turi:"
              value={
                isDeregister ? (
                  <Badge variant="error" className="py-1">
                    Reyestrdan chiqarish uchun
                  </Badge>
                ) : isStatusChange ? (
                  <Badge variant="warning" className="py-1">
                    Holatini o‘zgartirish
                  </Badge>
                ) : isRestore ? (
                  <Badge variant="success" className="py-1">
                    Reyestrga qaytarish
                  </Badge>
                ) : (
                  <Badge variant="info" className="py-1">
                    Ma’lumotlarni o‘zgartirish
                  </Badge>
                )
              }
            />
            <DetailRow title="Ijrochi mas’ul F.I.SH.:" value={changeDetail?.executorName || '-'} />

            {changeDetail?.description && (
              <div
                className={cn(
                  'grid grid-cols-1 gap-1 rounded-md px-2 py-1 odd:bg-neutral-50 md:grid-cols-2 md:items-center md:gap-4'
                )}
              >
                <span className={cn('text-sm font-medium text-gray-500')}>
                  {isRestore ? 'Qo‘mita izohi (qaytarish sababi):' : 'Qaytarish sababi:'}
                </span>

                <SafeHtml
                  html={changeDetail?.description}
                  fallback="-"
                  className="text-sm font-medium break-words text-gray-900"
                />
              </div>
            )}
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="applicant"
          title={`${isLegal ? 'Tashkilot to‘g‘risida ma’lumot' : 'Fuqaro to‘g‘risida ma’lumot'}`}
        >
          {isLegal ? (
            <LegalApplicantInfo tinNumber={changeDetail?.ownerIdentity} />
          ) : (
            <div className="flex flex-col py-1">
              <DetailRow title="Fuqaro JSHSHIR:" value={changeDetail?.ownerIdentity || '-'} />
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
