import { ApplicationStatus } from '@/entities/application'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from 'react-i18next'

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  [ApplicationStatus.NEW]: { pill: 'border-blue-200 bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  [ApplicationStatus.IN_PROCESS]: { pill: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  [ApplicationStatus.IN_AGREEMENT]: { pill: 'border-violet-200 bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  [ApplicationStatus.IN_APPROVAL]: { pill: 'border-cyan-200 bg-cyan-50 text-cyan-700', dot: 'bg-cyan-500' },
  [ApplicationStatus.COMPLETED]: { pill: 'border-emerald-200 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  [ApplicationStatus.REJECTED]: { pill: 'border-red-200 bg-red-50 text-red-700', dot: 'bg-red-500' },
  [ApplicationStatus.CANCELED]: { pill: 'border-orange-200 bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
}

const FALLBACK_STYLE = { pill: 'border-neutral-200 bg-neutral-50 text-neutral-700', dot: 'bg-neutral-400' }

export const ApplicationStatusBadge = ({ status, className }: ApplicationStatusBadgeProps) => {
  const { t } = useTranslation('common')
  const style = STATUS_STYLES[status] || FALLBACK_STYLE
  const label = STATUS_STYLES[status] ? t(`application_status.${status}`) : status

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs leading-none font-medium whitespace-nowrap',
        style.pill,
        className
      )}
    >
      <span className={cn('size-1.5 shrink-0 rounded-full', style.dot)} />
      {label}
    </span>
  )
}
