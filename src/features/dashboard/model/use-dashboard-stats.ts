import usePaginatedData from '@/shared/hooks/api/usePaginatedData'

const PAGE_SIZE_ONE = { page: 1, size: 1 }

export const useDashboardStats = (regionId?: string | null) => {
  const regionParam = regionId ? { regionId } : {}
  const commonParams = { ...PAGE_SIZE_ONE, ...regionParam }

  // HF Stats
  const { totalElements: hfTotal = 0 } = usePaginatedData('/hf', { ...commonParams, active: undefined })
  const { totalElements: hfActive = 0 } = usePaginatedData('/hf', { ...commonParams, active: 'true' })
  const { totalElements: hfInactive = 0 } = usePaginatedData('/hf', { ...commonParams, active: 'false' })

  // Equipment Stats
  const { totalElements: eqTotal = 0 } = usePaginatedData('/equipments', { ...commonParams })
  const { totalElements: eqActive = 0 } = usePaginatedData('/equipments', { ...commonParams, active: true })
  const { totalElements: eqInactive = 0 } = usePaginatedData('/equipments', { ...commonParams, active: false })
  const { totalElements: eqExpired = 0 } = usePaginatedData('/equipments', { ...commonParams, status: 'EXPIRED' })
  const { totalElements: eqNoDate = 0 } = usePaginatedData('/equipments', { ...commonParams, status: 'NO_DATE' })

  // IRS Stats
  const { totalElements: irsTotal = 0 } = usePaginatedData('/irs', { ...commonParams })
  const { totalElements: irsActive = 0 } = usePaginatedData('/irs', { ...commonParams, valid: true })
  const { totalElements: irsInactive = 0 } = usePaginatedData('/irs', { ...commonParams, valid: false })

  // X-ray Stats
  const { totalElements: xrayTotal = 0 } = usePaginatedData('/xrays', { ...commonParams })

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
      active: xrayTotal,
      inactive: 0,
    },
  }
}
