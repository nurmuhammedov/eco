import { useData } from '@/shared/hooks/api'
import { ISearchParams } from '@/shared/types'

/** Registry totals move slowly, so a tab switch should not refetch them. */
export const DASHBOARD_STALE_TIME = 5 * 60 * 1000

const useCount = (endpoint: string, params: ISearchParams, enabled: boolean) => {
  const { data, isFetching } = useData<number>(endpoint, enabled, params, [], DASHBOARD_STALE_TIME)

  return { count: data ?? 0, isFetching: enabled && isFetching }
}

export const useDashboardStats = (regionId?: string | null, activeCategory?: string) => {
  const base: ISearchParams = regionId ? { regionId } : {}

  const hfEnabled = activeCategory === 'hf'
  const hfActive = useCount('/hf/count', { ...base, active: true }, hfEnabled)
  const hfInactive = useCount('/hf/count', { ...base, active: false }, hfEnabled)

  const eqEnabled = activeCategory === 'equipment'
  const eqActive = useCount('/equipments/count', { ...base, active: true }, eqEnabled)
  const eqInactive = useCount('/equipments/count', { ...base, active: false }, eqEnabled)
  const eqExpired = useCount('/equipments/count', { ...base, active: true, status: 'EXPIRED' }, eqEnabled)
  const eqNoDate = useCount('/equipments/count', { ...base, active: true, status: 'NO_DATE' }, eqEnabled)

  // IrsParamsDto marks `valid` as @NotNull, so it must be sent on every call.
  const irsEnabled = activeCategory === 'irs'
  const irsActive = useCount('/irs/count', { ...base, valid: true }, irsEnabled)
  const irsInactive = useCount('/irs/count', { ...base, valid: false }, irsEnabled)

  const xrayEnabled = activeCategory === 'xray'
  const xrayActive = useCount('/xrays/count', { ...base, active: true }, xrayEnabled)
  const xrayInactive = useCount('/xrays/count', { ...base, active: false }, xrayEnabled)
  const xrayExpired = useCount('/xrays/count', { ...base, active: true, status: 'EXPIRED' }, xrayEnabled)
  const xrayNoDate = useCount('/xrays/count', { ...base, active: true, status: 'NO_DATE' }, xrayEnabled)

  return {
    hf: {
      total: hfActive.count + hfInactive.count,
      active: hfActive.count,
      inactive: hfInactive.count,
      isLoading: hfActive.isFetching || hfInactive.isFetching,
    },
    equipment: {
      total: eqActive.count + eqInactive.count,
      active: eqActive.count,
      inactive: eqInactive.count,
      expired: eqExpired.count,
      noDate: eqNoDate.count,
      isLoading: eqActive.isFetching || eqInactive.isFetching || eqExpired.isFetching || eqNoDate.isFetching,
    },
    irs: {
      total: irsActive.count + irsInactive.count,
      active: irsActive.count,
      inactive: irsInactive.count,
      isLoading: irsActive.isFetching || irsInactive.isFetching,
    },
    xray: {
      total: xrayActive.count + xrayInactive.count,
      active: xrayActive.count,
      inactive: xrayInactive.count,
      expired: xrayExpired.count,
      noDate: xrayNoDate.count,
      isLoading: xrayActive.isFetching || xrayInactive.isFetching || xrayExpired.isFetching || xrayNoDate.isFetching,
    },
  }
}
