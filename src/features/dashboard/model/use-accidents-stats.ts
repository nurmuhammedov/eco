import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { DASHBOARD_STALE_TIME } from './use-dashboard-stats'

const PAGE_SIZE_ONE = { page: 1, size: 1 }

export const useAccidentsStats = (regionId?: string | null) => {
  const regionParam = regionId ? { regionId } : {}
  const commonParams = { ...PAGE_SIZE_ONE, ...regionParam }

  // Baxtsiz hodisalar (INJURY)
  const { totalElements: injuryTotal = 0 } = usePaginatedData(
    '/accidents',
    { ...commonParams, type: 'INJURY' },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: injuryNew = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'INJURY',
      status: 'NEW',
    },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: injuryProcess = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'INJURY',
      status: 'IN_PROCESS',
    },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: injuryCompleted = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'INJURY',
      status: 'COMPLETED',
    },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: injuryDecreeUploaded = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'INJURY',
      status: 'DECREE_UPLOADED',
    },
    true,
    DASHBOARD_STALE_TIME
  )

  // Avariyalar (NON_INJURY)
  const { totalElements: nonInjuryTotal = 0 } = usePaginatedData(
    '/accidents',
    { ...commonParams, type: 'NON_INJURY' },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: nonInjuryNew = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'NON_INJURY',
      status: 'NEW',
    },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: nonInjuryProcess = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'NON_INJURY',
      status: 'IN_PROCESS',
    },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: nonInjuryCompleted = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'NON_INJURY',
      status: 'COMPLETED',
    },
    true,
    DASHBOARD_STALE_TIME
  )
  const { totalElements: nonInjuryDecreeUploaded = 0 } = usePaginatedData(
    '/accidents',
    {
      ...commonParams,
      type: 'NON_INJURY',
      status: 'DECREE_UPLOADED',
    },
    true,
    DASHBOARD_STALE_TIME
  )

  return {
    injury: {
      total: injuryTotal,
      new: injuryNew,
      process: injuryProcess,
      completed: injuryCompleted,
      decreeUploaded: injuryDecreeUploaded,
    },
    nonInjury: {
      total: nonInjuryTotal,
      new: nonInjuryNew,
      process: nonInjuryProcess,
      completed: nonInjuryCompleted,
      decreeUploaded: nonInjuryDecreeUploaded,
    },
  }
}
