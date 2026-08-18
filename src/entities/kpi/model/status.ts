import { CheckCircle2, Clock, FileEdit, RotateCcw, Send, type LucideIcon } from 'lucide-react'
import type { KpiCalculationType, KpiResultStatus, KpiTaskStatus } from './types'

type BadgeVariant = 'default' | 'info' | 'warning' | 'success' | 'error' | 'secondary' | 'outline'

interface StatusConfig {
  label: string
  variant: BadgeVariant
  icon: LucideIcon
}

export const KPI_CALCULATION_TYPE: Record<KpiCalculationType, { label: string; short: string; variant: BadgeVariant }> =
  {
    PLAN: { label: 'Reja bo‘yicha', short: 'Reja', variant: 'info' },
    PENALTY: { label: 'Xatolik (jarima)', short: 'Jarima', variant: 'error' },
  }

export const KPI_RESULT_STATUS: Record<KpiResultStatus, StatusConfig> = {
  DRAFT: { label: 'Qoralama', variant: 'warning', icon: FileEdit },
  PENDING: { label: 'Tekshiruvda', variant: 'info', icon: Clock },
  APPROVED: { label: 'Tasdiqlangan', variant: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Qaytarilgan', variant: 'error', icon: RotateCcw },
}

export const KPI_TASK_STATUS: Record<KpiTaskStatus, StatusConfig> = {
  NOT_STARTED: { label: 'Boshlanmagan', variant: 'secondary', icon: FileEdit },
  IN_PROGRESS: { label: 'To‘ldirilmoqda', variant: 'warning', icon: FileEdit },
  PENDING: { label: 'Tekshiruvda', variant: 'info', icon: Send },
  REJECTED: { label: 'Qaytarilgan', variant: 'error', icon: RotateCcw },
  APPROVED: { label: 'Tasdiqlangan', variant: 'success', icon: CheckCircle2 },
}

export const isResultEditable = (status?: KpiResultStatus | null): boolean =>
  !status || status === 'DRAFT' || status === 'REJECTED'

// The theme has no success/warning tokens, so the Tailwind palette is used here
// the same way other modules do.
export const completionColor = (rate: number): string =>
  rate >= 75 ? 'text-green-600' : rate >= 50 ? 'text-amber-500' : 'text-red-600'

export const completionBarColor = (rate: number): string =>
  rate >= 75 ? '[&>div]:bg-green-600' : rate >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-600'
