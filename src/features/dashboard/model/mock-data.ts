export const TABS_STATS = {
  hf: {
    total: 822,
    active: 750,
    inactive: 72,
  },
  equipment: {
    total: 39804,
    active: 38015,
    inactive: 1547,
    expired: 58,
    noDate: 200,
  },
  irs: {
    total: 111,
    active: 95,
    inactive: 16,
  },
  xray: {
    total: 45,
    active: 40,
    inactive: 5,
  },
}

export const RISK_ANALYSIS_STATS = {
  highRisk: 58,
  mediumRisk: 65,
  highRiskList: [
    { name: 'XICHO', count: 12 },
    { name: 'INM', count: 5 },
    { name: 'Lift', count: 8 },
    { name: 'Attraksion', count: 2 },
    { name: 'Rentgen', count: 4 },
    { name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma', count: 27 },
  ],
  mediumRiskList: [
    { name: 'XICHO', count: 5 },
    { name: 'INM', count: 2 },
    { name: 'Lift', count: 15 },
    { name: 'Attraksion', count: 8 },
    { name: 'Rentgen', count: 1 },
    { name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma', count: 10 },
  ],
  lowRiskList: [
    { name: 'XICHO', count: 2 },
    { name: 'INM', count: 0 },
    { name: 'Lift', count: 5 },
    { name: 'Attraksion', count: 1 },
    { name: 'Rentgen', count: 12 },
    { name: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma', count: 4 },
  ],
}
