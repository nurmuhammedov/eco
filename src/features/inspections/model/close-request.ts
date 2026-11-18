import type { QueryClient } from '@tanstack/react-query'
import { ApplicationStatus } from '@/entities/application'
import { InspectionStatus } from '@/entities/inspection/model/inspection-status'
import type { ChangeLogEntry } from '@/entities/registry'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

/**
 * Closing an inspection without conducting it. The region sends a request with
 * a basis file; the committee's MANAGER confirms it, and only then does the
 * inspection become CLOSED, or returns it to the region with a comment.
 */
export const CLOSE_INSPECTION = 'CLOSE_INSPECTION'

/** The request's own page: the one the registry's change requests open on */
export const closeRequestPath = (inspectionId: string) => `/register/change/inspections/${inspectionId}`

/** The statuses of an inspection not conducted yet: only such an inspection can be asked to be closed */
const CLOSABLE_STATUSES: readonly string[] = [
  InspectionStatus.NEW,
  InspectionStatus.NOTIFIED,
  InspectionStatus.NOT_SIGNED,
  InspectionStatus.ASSIGNED,
]

export const isClosableStatus = (status?: string | null) => !!status && CLOSABLE_STATUSES.includes(status)

/** The fields a close request writes to its change log */
export const CLOSE_LOG_FIELDS = { basis: 'closeBasisPath', comment: 'closeComment' } as const

/** Log entries this close together were written by one sending of the request */
const SAME_SENDING_MS = 60_000

const loggedAt = (entry: ChangeLogEntry) => (entry.createdAt ? new Date(entry.createdAt).getTime() : 0)

const latestOf = (logs: ChangeLogEntry[], fieldName: string) =>
  logs
    .filter((entry) => entry.fieldName === fieldName && !!entry.newValue)
    .reduce<ChangeLogEntry | null>(
      (latest, entry) => (!latest || loggedAt(entry) >= loggedAt(latest) ? entry : latest),
      null
    )

/**
 * What the request was last sent with. Every sending logs the basis file but a
 * comment only when one was written, so a comment is shown only when it was
 * logged together with the latest file - an older one belongs to a sending the
 * MANAGER has already turned back.
 */
export const latestCloseSending = (logs: ChangeLogEntry[] = []) => {
  const basis = latestOf(logs, CLOSE_LOG_FIELDS.basis)
  const comment = latestOf(logs, CLOSE_LOG_FIELDS.comment)
  const isSameSending = !!basis && !!comment && Math.abs(loggedAt(comment) - loggedAt(basis)) <= SAME_SENDING_MS

  return {
    basisPath: basis?.newValue ?? null,
    comment: isSameSending ? (comment?.newValue ?? null) : null,
  }
}

export type CloseSending = ReturnType<typeof latestCloseSending>

/**
 * The sub-tabs of the open requests, by the status the request is in. The URL
 * carries the pick as `closeStatus`, apart from the other tabs' `subStatus`.
 */
export const CLOSE_REQUEST_SUB_TABS = [
  { id: ApplicationStatus.IN_APPROVAL, name: 'Tasdiqlashda' },
  { id: ApplicationStatus.IN_PROCESS, name: 'Qaytarilgan' },
] as const

/** The requests tab as the `closeRequestStatus` filter its sub-tab stands for; the first sub-tab until one is picked */
export const closeRequestStatusOfTab = (tab?: string | null, closeStatus?: string | null) => {
  if (tab !== InspectionStatus.CLOSE_REQUESTS) return undefined

  return closeStatus === ApplicationStatus.IN_PROCESS ? ApplicationStatus.IN_PROCESS : ApplicationStatus.IN_APPROVAL
}

/**
 * What sending, confirming or returning a close request leaves stale: the
 * request with its log and history, and the inspection with the lists and
 * counts it is in.
 */
export const invalidateCloseRequest = (queryClient: QueryClient) => {
  void invalidateEndpoint(queryClient, '/inspections')
  void invalidateEndpoint(queryClient, '/changes/by-belong')
  void invalidateEndpoint(queryClient, '/change-logs')
  void invalidateEndpoint(queryClient, '/execution-processes/change')
}
