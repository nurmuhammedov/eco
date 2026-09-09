import { useData } from '@/shared/hooks/api'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { ISearchParams } from '@/shared/types'

/** Registry totals move slowly, so a tab switch should not refetch them. */
export const DASHBOARD_STALE_TIME = 5 * 60 * 1000

/** The registry/archive divide, which every `/count` endpoint takes directly. */
const useCount = (endpoint: string, params: ISearchParams, enabled: boolean) => {
  const { data, isFetching } = useData<number>(endpoint, enabled, params, [], DASHBOARD_STALE_TIME)

  return { count: data ?? 0, isFetching: enabled && isFetching }
}

/**
 * Status breakdowns are read off the same list endpoint the card links to, one
 * row at a time. A tile promising a number the destination then contradicts is
 * worse than a slightly heavier request, and this way the two cannot disagree.
 */
const useListCount = (endpoint: string, params: ISearchParams, enabled: boolean) => {
  const { totalElements, isFetching } = usePaginatedData(
    endpoint,
    { page: 1, size: 1, ...params },
    enabled,
    DASHBOARD_STALE_TIME
  )

  return { count: Number(totalElements ?? 0), isFetching: enabled && isFetching }
}

export const useDashboardStats = (regionId?: string | null, activeCategory?: string) => {
  const base: ISearchParams = regionId ? { regionId } : {}

  const hfEnabled = activeCategory === 'hf'
  const hfActive = useCount('/hf/count', { ...base, active: true }, hfEnabled)
  const hfInactive = useCount('/hf/count', { ...base, active: false }, hfEnabled)
  // The two tabs the registry itself offers inside "Reyestrdagi XICHOlar".
  const hfValid = useListCount('/hf', { ...base, active: true, status: 'VALID' }, hfEnabled)
  const hfInvalid = useListCount('/hf', { ...base, active: true, status: 'INVALID' }, hfEnabled)

  const eqEnabled = activeCategory === 'equipment'
  const eqActive = useCount('/equipments/count', { ...base, active: true }, eqEnabled)
  const eqInactive = useCount('/equipments/count', { ...base, active: false }, eqEnabled)
  // Asked for rather than derived: `active` also covers INVALID, so subtracting
  // the two dated statuses would quietly fold that into the valid figure.
  const eqExpired = useListCount('/equipments', { ...base, active: true, status: 'EXPIRED' }, eqEnabled)
  const eqNoDate = useListCount('/equipments', { ...base, active: true, status: 'NO_DATE' }, eqEnabled)
  const eqValid = useListCount('/equipments', { ...base, active: true, status: 'VALID' }, eqEnabled)
  const eqInvalid = useListCount('/equipments', { ...base, active: true, status: 'INVALID' }, eqEnabled)

  // IrsParamsDto marks `valid` as @NotNull, so it must be sent on every call.
  const irsEnabled = activeCategory === 'irs'
  const irsActive = useCount('/irs/count', { ...base, valid: true }, irsEnabled)
  const irsInactive = useCount('/irs/count', { ...base, valid: false }, irsEnabled)

  const xrayEnabled = activeCategory === 'xray'
  const xrayActive = useCount('/xrays/count', { ...base, active: true }, xrayEnabled)
  const xrayInactive = useCount('/xrays/count', { ...base, active: false }, xrayEnabled)
  const xrayExpired = useListCount('/xrays', { ...base, active: true, status: 'EXPIRED' }, xrayEnabled)
  const xrayNoDate = useListCount('/xrays', { ...base, active: true, status: 'NO_DATE' }, xrayEnabled)

  return {
    hf: {
      total: hfActive.count + hfInactive.count,
      active: hfActive.count,
      inactive: hfInactive.count,
      valid: hfValid.count,
      invalid: hfInvalid.count,
      isLoading: [hfActive, hfInactive, hfValid, hfInvalid].some((query) => query.isFetching),
    },
    equipment: {
      total: eqActive.count + eqInactive.count,
      active: eqActive.count,
      inactive: eqInactive.count,
      expired: eqExpired.count,
      noDate: eqNoDate.count,
      valid: eqValid.count,
      invalid: eqInvalid.count,
      isLoading: [eqActive, eqInactive, eqExpired, eqNoDate, eqValid, eqInvalid].some((query) => query.isFetching),
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
      isLoading: [xrayActive, xrayInactive, xrayExpired, xrayNoDate].some((query) => query.isFetching),
    },
  }
}
