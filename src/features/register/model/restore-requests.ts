import type { UrlParamValue } from '@/shared/types'
import { UserRoles } from '@/shared/types/user'

/**
 * The archive's "restore requests" tab: deregistered records with a pending
 * request to put them back. Such a request is either with the committee or
 * returned to its sender; it has no NEW or IN_AGREEMENT stage.
 */
export const RESTORE_REQUEST_TABS = [
  { id: 'IN_APPROVAL', name: 'Tasdiqlashda' },
  { id: 'IN_PROCESS', name: 'Qaytarilgan' },
]

/** The sub-tab the URL points at; anything else falls back to the first one */
export const restoreRequestStatus = (value: UrlParamValue | undefined) =>
  RESTORE_REQUEST_TABS.some(({ id }) => id === String(value)) ? String(value) : RESTORE_REQUEST_TABS[0].id

/**
 * The sub-tab a role has to act on, which the tab badge counts and the tab opens
 * on: MANAGER decides the requests with the committee, a REGIONAL (supervisors
 * included) fixes the returned ones.
 */
export const actionableRestoreStatus = (role: UserRoles | undefined) =>
  role === UserRoles.REGIONAL ? 'IN_PROCESS' : RESTORE_REQUEST_TABS[0].id
