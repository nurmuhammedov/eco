import { Link } from 'react-router-dom'
import { ApplicationStatus } from '@/entities/application'
import type { InspectionDetail } from '@/entities/inspection/model/inspection.types'
import type { ChangeLogEntry, RegistryChange } from '@/entities/registry'
import DetailRow from '@/shared/components/common/detail-row'
import FileLink from '@/shared/components/common/file-link'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { usePaginatedData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { getDate } from '@/shared/utils/date'
import { closeRequestPath, latestCloseSending } from '@/features/inspections/model/close-request'
import { CloseInspectionModal } from './close-inspection-modal'

/** What an inspection closed without being conducted was closed on */
export const ClosedInspectionInfo = ({ inspection }: { inspection?: InspectionDetail }) => (
  <div className="flex flex-col py-1">
    <DetailRow title="Yakunlangan sana:" value={getDate(inspection?.closedDate) || <EmptyValue />} />
    <DetailRow
      title="Yakunlashga asos:"
      value={inspection?.closeBasisPath ? <FileLink url={inspection.closeBasisPath} /> : <EmptyValue />}
    />
    <DetailRow
      title="Yakunlash uchun izoh:"
      value={inspection?.closeComment ? <span className="whitespace-pre-line">{inspection.closeComment}</span> : null}
    />
  </div>
)

interface HeaderProps {
  inspectionId: string
  closeRequest: RegistryChange | null
}

/**
 * The open request at the head of the inspection's page, as the registry shows
 * a pending change on its records: where it stands, the way to its page for the
 * region and the MANAGER, and sending it again once it came back. The MANAGER
 * decides on the request's own page.
 */
export const CloseRequestHeader = ({ inspectionId, closeRequest }: HeaderProps) => {
  const { user } = useAuth()

  const isInApproval = closeRequest?.status === ApplicationStatus.IN_APPROVAL
  const isReturned = closeRequest?.status === ApplicationStatus.IN_PROCESS
  const canResend = isReturned && user?.role === UserRoles.REGIONAL
  const canOpen = user?.role === UserRoles.REGIONAL || user?.role === UserRoles.MANAGER

  // A resending starts from the comment it was last sent with
  const { data: logs } = usePaginatedData<ChangeLogEntry>(
    `/change-logs/by-change/${closeRequest?.id}`,
    { page: 1, size: 100 },
    !!closeRequest?.id && canResend
  )

  // A confirmed request is kept too: its page tells who closed the inspection and when
  if (!closeRequest || (!isInApproval && !isReturned && closeRequest.status !== ApplicationStatus.COMPLETED)) {
    return null
  }

  return (
    <>
      {isInApproval && (
        <Badge variant="info" className="py-2">
          Yakunlash so‘rovi tasdiqlashda
        </Badge>
      )}
      {isReturned && (
        <Badge variant="warning" className="py-2">
          Yakunlash so‘rovi qaytarilgan
        </Badge>
      )}
      {canResend && (
        <CloseInspectionModal inspectionId={inspectionId} isResubmit previous={latestCloseSending(logs?.content)} />
      )}
      {canOpen && (
        <Button asChild variant={user?.role === UserRoles.MANAGER ? 'info' : 'outline'}>
          <Link to={closeRequestPath(inspectionId)}>So‘rovni ko‘rish</Link>
        </Button>
      )}
    </>
  )
}
