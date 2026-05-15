import usePaginatedData from '@/shared/hooks/api/usePaginatedData'

const PAGE_SIZE_ONE = { page: 1, size: 1 }

export const useDashboardStats = (regionId?: string | null, activeCategory?: string) => {
  const regionParam = regionId ? { regionId } : {}
  const commonParams = { ...PAGE_SIZE_ONE, ...regionParam }

  // HF Stats
  const hfEnabled = activeCategory === 'hf'
  const { totalElements: hfTotal = 0 } = usePaginatedData('/hf', { ...commonParams, active: true }, hfEnabled)
  const { totalElements: hfActive = 0 } = usePaginatedData('/hf', { ...commonParams, active: true }, hfEnabled)
  const { totalElements: hfInactive = 0 } = usePaginatedData('/hf', { ...commonParams, active: false }, hfEnabled)

  // Equipment Stats
  const eqEnabled = activeCategory === 'equipment'
  const { totalElements: eqTotal = 0 } = usePaginatedData('/equipments', { ...commonParams, active: true }, eqEnabled)
  const { totalElements: eqActive = 0 } = usePaginatedData('/equipments', { ...commonParams, active: true }, eqEnabled)
  const { totalElements: eqInactive = 0 } = usePaginatedData(
    '/equipments',
    { ...commonParams, active: false },
    eqEnabled
  )
  const { totalElements: eqExpired = 0 } = usePaginatedData(
    '/equipments',
    {
      ...commonParams,
      status: 'EXPIRED',
      active: true,
    },
    eqEnabled
  )
  const { totalElements: eqNoDate = 0 } = usePaginatedData(
    '/equipments',
    {
      ...commonParams,
      status: 'NO_DATE',
      active: true,
    },
    eqEnabled
  )

  // IRS Stats
  const irsEnabled = activeCategory === 'irs'
  const { totalElements: irsTotal = 0 } = usePaginatedData('/irs', { ...commonParams, valid: true }, irsEnabled)
  const { totalElements: irsActive = 0 } = usePaginatedData('/irs', { ...commonParams, valid: true }, irsEnabled)
  const { totalElements: irsInactive = 0 } = usePaginatedData('/irs', { ...commonParams, valid: false }, irsEnabled)

  // X-ray Stats
  const xrayEnabled = activeCategory === 'xray'
  const { totalElements: xrayTotal = 0 } = usePaginatedData('/xrays', { ...commonParams, active: true }, xrayEnabled)
  const { totalElements: xrayActive = 0 } = usePaginatedData('/xrays', { ...commonParams, active: true }, xrayEnabled)
  const { totalElements: xrayInactive = 0 } = usePaginatedData(
    '/xrays',
    { ...commonParams, active: false },
    xrayEnabled
  )
  const { totalElements: xrayExpired = 0 } = usePaginatedData(
    '/xrays',
    {
      ...commonParams,
      status: 'EXPIRED',
      active: true,
    },
    xrayEnabled
  )

  const { totalElements: xrayNoDate = 0 } = usePaginatedData(
    '/xrays',
    {
      ...commonParams,
      status: 'NO_DATE',
      active: true,
    },
    xrayEnabled
  )

  return {
    hf: {
      total: hfTotal,
      active: hfActive,
      inactive: hfInactive,
    },
    equipment: {
      total: eqTotal,
      active: eqActive,
      inactive: eqInactive,
      expired: eqExpired,
      noDate: eqNoDate,
    },
    irs: {
      total: irsTotal,
      active: irsActive,
      inactive: irsInactive,
    },
    xray: {
      total: xrayTotal,
      active: xrayActive,
      inactive: xrayInactive,
      expired: xrayExpired,
      noDate: xrayNoDate,
    },
  }
}
