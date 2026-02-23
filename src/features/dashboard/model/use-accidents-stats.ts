import usePaginatedData from '@/shared/hooks/api/usePaginatedData'

const PAGE_SIZE_ONE = { page: 1, size: 1 }

export const useAccidentsStats = (regionId?: string | null) => {
  const regionParam = regionId ? { regionId } : {}
  const commonParams = { ...PAGE_SIZE_ONE, ...regionParam }

  // Baxtsiz hodisalar (INJURY)
  const { totalElements: injuryTotal = 0 } = usePaginatedData('/accidents', { ...commonParams, type: 'INJURY' })
  const { totalElements: injuryNew = 0 } = usePaginatedData('/accidents', {
    ...commonParams,
    type: 'INJURY',
    status: 'NEW',
  })
  const { totalElements: injuryProcess = 0 } = usePaginatedData('/accidents', {
    ...commonParams,
    type: 'INJURY',
    status: 'IN_PROCESS',
  })
  const { totalElements: injuryCompleted = 0 } = usePaginatedData('/accidents', {
    ...commonParams,
    type: 'INJURY',
    status: 'COMPLETED',
  })

  // Avariyalar (NON_INJURY)
  const { totalElements: nonInjuryTotal = 0 } = usePaginatedData('/accidents', { ...commonParams, type: 'NON_INJURY' })
  const { totalElements: nonInjuryNew = 0 } = usePaginatedData('/accidents', {
    ...commonParams,
    type: 'NON_INJURY',
    status: 'NEW',
  })
  const { totalElements: nonInjuryProcess = 0 } = usePaginatedData('/accidents', {
    ...commonParams,
    type: 'NON_INJURY',
    status: 'IN_PROCESS',
  })
  const { totalElements: nonInjuryCompleted = 0 } = usePaginatedData('/accidents', {
    ...commonParams,
    type: 'NON_INJURY',
    status: 'COMPLETED',
  })

  return {
    injury: {
      total: injuryTotal,
      new: injuryNew,
      process: injuryProcess,
      completed: injuryCompleted,
    },
    nonInjury: {
      total: nonInjuryTotal,
      new: nonInjuryNew,
      process: nonInjuryProcess,
      completed: nonInjuryCompleted,
    },
  }
}
