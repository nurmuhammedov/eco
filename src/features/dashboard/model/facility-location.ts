export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type HfStatus = 'VALID' | 'INVALID' | 'INACTIVE'

/** One entry of `/hf/locations`, the whole registry reduced to what a pin needs. */
export interface FacilityLocation {
  id: string
  name: string
  legalTin: number
  legalName: string
  location: string
  registryNumber: string
  regionId: number | null
  status: HfStatus
  /** Null until a daily risk analysis exists for the facility. */
  riskLevel: RiskLevel | null
}

/**
 * Colour carries the risk level, matching the cards on the same page so the two
 * read as one dataset. A facility with no analysis for the day falls back to
 * its registry status rather than to green - absent is not the same as safe.
 */
export const RISK_STYLE: Record<RiskLevel, { color: string; label: string }> = {
  LOW: { color: '#10b981', label: 'Xavfi past' },
  MEDIUM: { color: '#f59e0b', label: 'Xavfi o‘rta' },
  HIGH: { color: '#f43f5e', label: 'Xavfi yuqori' },
}

export const STATUS_STYLE: Record<HfStatus, { color: string; label: string }> = {
  VALID: { color: '#0b626b', label: 'Amaldagi' },
  INVALID: { color: '#94a3b8', label: 'Vaqtinchalik nofaol' },
  INACTIVE: { color: '#cbd5e1', label: 'Reyestrdan chiqarilgan' },
}

export const markerColor = (facility: Pick<FacilityLocation, 'riskLevel' | 'status'>) =>
  (facility.riskLevel && RISK_STYLE[facility.riskLevel]?.color) || STATUS_STYLE[facility.status]?.color || '#94a3b8'
