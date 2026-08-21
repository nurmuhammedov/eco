import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { ISearchParams } from '@/shared/types'
import { DASHBOARD_STALE_TIME } from './use-dashboard-stats'

/** Only the count is needed, so a single row is requested. */
const COUNT_ONLY = { page: 1, size: 1 }

const useAccidentCount = (params: ISearchParams) => usePaginatedData('/accidents', params, true, DASHBOARD_STALE_TIME)

export const useAccidentsStats = (regionId?: string | null) => {
  const base: ISearchParams = { ...COUNT_ONLY, ...(regionId ? { regionId } : {}) }

  // Called individually rather than in a loop so the hook order stays fixed.
  const injuryTotal = useAccidentCount({ ...base, type: 'INJURY' })
  const injuryNew = useAccidentCount({ ...base, type: 'INJURY', status: 'NEW' })
  const injuryProcess = useAccidentCount({ ...base, type: 'INJURY', status: 'IN_PROCESS' })
  const injuryCompleted = useAccidentCount({ ...base, type: 'INJURY', status: 'COMPLETED' })
  const injuryDecree = useAccidentCount({ ...base, type: 'INJURY', status: 'DECREE_UPLOADED' })

  const nonInjuryTotal = useAccidentCount({ ...base, type: 'NON_INJURY' })
  const nonInjuryNew = useAccidentCount({ ...base, type: 'NON_INJURY', status: 'NEW' })
  const nonInjuryProcess = useAccidentCount({ ...base, type: 'NON_INJURY', status: 'IN_PROCESS' })
  const nonInjuryCompleted = useAccidentCount({ ...base, type: 'NON_INJURY', status: 'COMPLETED' })
  const nonInjuryDecree = useAccidentCount({ ...base, type: 'NON_INJURY', status: 'DECREE_UPLOADED' })

  const queries = [
    injuryTotal,
    injuryNew,
    injuryProcess,
    injuryCompleted,
    injuryDecree,
    nonInjuryTotal,
    nonInjuryNew,
    nonInjuryProcess,
    nonInjuryCompleted,
    nonInjuryDecree,
  ]

  return {
    injury: {
      total: injuryTotal.totalElements ?? 0,
      new: injuryNew.totalElements ?? 0,
      process: injuryProcess.totalElements ?? 0,
      completed: injuryCompleted.totalElements ?? 0,
      decreeUploaded: injuryDecree.totalElements ?? 0,
    },
    nonInjury: {
      total: nonInjuryTotal.totalElements ?? 0,
      new: nonInjuryNew.totalElements ?? 0,
      process: nonInjuryProcess.totalElements ?? 0,
      completed: nonInjuryCompleted.totalElements ?? 0,
      decreeUploaded: nonInjuryDecree.totalElements ?? 0,
    },
    // A real zero and a not-yet-loaded zero must not look the same on a safety dashboard.
    isLoading: queries.some((query) => query.isFetching && query.data === undefined),
  }
}
