import { format } from 'date-fns'
import { Badge } from '@/shared/components/ui/badge'
import type { RiskAnalysisLevel } from '@/entities/risk-analysis/model/risk-analysis.types'

/** The same wording the statistics cards use for each band. */
export const RISK_LEVEL_LABELS: Record<RiskAnalysisLevel, string> = {
  LOW: 'Xavfi past',
  MEDIUM: 'Xavfi o‘rta',
  HIGH: 'Xavfi yuqori',
}

const RISK_LEVEL_VARIANTS = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'destructive',
} as const

export const RiskLevelBadge = ({ level }: { level?: RiskAnalysisLevel | null }) =>
  level ? <Badge variant={RISK_LEVEL_VARIANTS[level]}>{RISK_LEVEL_LABELS[level]}</Badge> : <>—</>

/** A warning only goes out for MEDIUM and HIGH, so LOW never has one to send. */
export const canHaveWarning = (level?: RiskAnalysisLevel | null) => level === 'MEDIUM' || level === 'HIGH'

export const WarningStateBadge = ({
  level,
  warningDate,
}: {
  level?: RiskAnalysisLevel | null
  warningDate?: string | null
}) => {
  if (warningDate) return <Badge variant="success">Yuborilgan ({format(new Date(warningDate), 'dd.MM.yyyy')})</Badge>
  if (canHaveWarning(level)) return <Badge variant="warning">Yuborilmagan</Badge>
  return <>—</>
}

export const WARNING_FILTER_OPTIONS = [
  { id: 'true', name: 'Yuborilgan' },
  { id: 'false', name: 'Yuborilmagan' },
]

export type PostalMailStatus =
  | 'SENT_TO_POST'
  | 'INSUFFICIENT_FUNDS'
  | 'SENT_TO_CLIENT'
  | 'RECEIVED_BY_CLIENT'
  | 'UNKNOWN'

export const postalMailStatusLabel = (status?: PostalMailStatus | null) => {
  switch (status) {
    case 'SENT_TO_POST':
      return 'Pochtaga yuborildi'
    case 'INSUFFICIENT_FUNDS':
      return 'Hisobda mablag‘ yetarli emas'
    case 'SENT_TO_CLIENT':
      return 'Qabul qiluvchiga jo‘natildi'
    case 'RECEIVED_BY_CLIENT':
      return 'Qabul qiluvchi oldi'
    case 'UNKNOWN':
      return 'Noma’lum'
    default:
      return 'Pochta orqali yuborilmagan'
  }
}
