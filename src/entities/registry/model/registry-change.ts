import type { ApplicationStatus } from '@/entities/application'

/** Change (`GET /changes/by-belong/{id}`): the latest pending change to a registry record */
export interface RegistryChange {
  id: string
  belongId: string | null
  /** What kind of change it is: UPDATE_HF, DEREGISTER_EQP, CHANGE_HF_STATUS... */
  belongType: string | null
  status: ApplicationStatus | null
  ownerIdentity: number | null
  description: string | null
  executorId: string | null
  executorName: string | null
  regionId: number | null
  createdAt: string | null
}
