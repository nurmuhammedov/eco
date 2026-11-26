import { ApplicationStatus } from '@/entities/application'

/**
 * ChangeStatus.AUTO_CANCELLED: the system closes a request left IN_PROCESS for
 * more than 30 days. Final, like COMPLETED, and its changes are never applied.
 * Kept apart from ApplicationStatus, whose values are also the appeals' tabs.
 */
export const CHANGE_AUTO_CANCELLED = 'AUTO_CANCELLED'

/** ChangeStatus on the server */
export type ChangeStatus = ApplicationStatus | typeof CHANGE_AUTO_CANCELLED

/** Change (`GET /changes/by-belong/{id}`): the latest pending change to a registry record */
export interface RegistryChange {
  id: string
  belongId: string | null
  /**
   * What kind of change it is: UPDATE_HF, DEREGISTER_EQP, CHANGE_HF_STATUS...
   * RESTORE_HF / RESTORE_EQP put a deregistered record back (cranes use RESTORE_EQP too).
   */
  belongType: string | null
  status: ChangeStatus | null
  ownerIdentity: number | null
  description: string | null
  executorId: string | null
  executorName: string | null
  regionId: number | null
  createdAt: string | null
}

/**
 * A request to put a deregistered record back in the registry. It skips the
 * regional agreement step: the committee's MANAGER confirms or returns it.
 */
export const isRestoreChange = (belongType?: string | null) => !!belongType?.startsWith('RESTORE_')

/** A request in either of these is closed: nothing more is done with it, and a new one may be sent */
const CLOSED_CHANGE_STATUSES: readonly (string | null | undefined)[] = [
  ApplicationStatus.COMPLETED,
  CHANGE_AUTO_CANCELLED,
]

/** There is a request and it is still open, so the backend refuses another one for the record */
export const isActiveChange = (change?: { status?: string | null } | null) =>
  !!change && !CLOSED_CHANGE_STATUSES.includes(change.status)

/**
 * The registry section a request belongs to, by its type. Read from the request
 * itself because the address it is opened at may name another one: the
 * auto-cancel notification links every type through `equipments`.
 */
export const changeSectionOf = (belongType?: string | null) => {
  if (!belongType) return undefined
  if (belongType === 'CLOSE_INSPECTION') return 'inspections'
  if (belongType === 'UPDATE_R_PROFILE') return 'radiation-profiles'
  if (/_HF(_|$)/.test(belongType)) return 'hf'
  if (/_EQP(_|$)/.test(belongType)) return 'equipments'
  if (/_IRS$/.test(belongType)) return 'irs'
  if (/_XRAY$/.test(belongType)) return 'xrays'

  return undefined
}
