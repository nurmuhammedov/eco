import { ApplicationStatus } from '@/entities/application'
import { useLastChange } from '@/features/register/common/model/use-last-change'
import { CLOSE_INSPECTION } from '@/features/inspections/model/close-request'

/**
 * The request to close an inspection without conducting it, if there is one.
 * `/changes/by-belong` answers the inspection's latest change of any kind, so
 * anything other than a close request is read as none.
 */
export const useCloseRequest = (inspectionId: string | undefined, enabled: boolean) => {
  const { lastChange, isResolved } = useLastChange(inspectionId, enabled)

  const closeRequest = lastChange?.belongType === CLOSE_INSPECTION ? lastChange : null
  const isInApproval = closeRequest?.status === ApplicationStatus.IN_APPROVAL
  const isReturned = closeRequest?.status === ApplicationStatus.IN_PROCESS

  return {
    closeRequest,
    /** The answer is in: until then no new request is offered */
    isResolved,
    isInApproval,
    isReturned,
    /** While a request is open the backend refuses the inspection's next steps */
    isActive: isInApproval || isReturned,
  }
}
