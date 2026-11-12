import type { ApplicationStatus } from '@/entities/application'

/** Change (`GET /changes/by-belong/{id}`): the latest pending change to a registry record */
export interface RegistryChange {
  id: string
  belongId: string | null
  /**
   * What kind of change it is: UPDATE_HF, DEREGISTER_EQP, CHANGE_HF_STATUS...
   * RESTORE_HF / RESTORE_EQP put a deregistered record back (cranes use RESTORE_EQP too).
   */
  belongType: string | null
  status: ApplicationStatus | null
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
