import { format } from 'date-fns'
import { Check, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import type { KpiApprovalSummary } from '../model/types'

/**
 * Two signatures are needed, so a single badge cannot say where a result
 * stands: "under review" reads the same whether nobody has looked at it or one
 * of the two has already signed. The marks below show which.
 */
export const ApprovalTrail = ({ approvals }: { approvals?: KpiApprovalSummary }) => {
  if (!approvals?.required) return null

  const { required, approved, entries } = approvals
  const rejected = entries.find((entry) => entry.decision === 'REJECTED')
  const signed = entries.filter((entry) => entry.decision === 'APPROVED')

  const marks = Array.from({ length: required }, (_, index) => {
    const entry = rejected && index === 0 ? rejected : signed[index]

    return { entry, isRejected: entry?.decision === 'REJECTED' }
  })

  const label = rejected ? 'Qaytarildi' : `${approved}/${required} imzolandi`

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-default items-center gap-1.5">
            <span className="flex items-center gap-1">
              {marks.map(({ entry, isRejected }, index) => (
                <span
                  key={index}
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
                    isRejected && 'border-red-500 bg-red-500 text-white',
                    !isRejected && entry && 'border-green-600 bg-green-600 text-white',
                    !entry && 'border-dashed border-neutral-300 bg-white'
                  )}
                >
                  {isRejected ? <X className="h-2.5 w-2.5" /> : entry ? <Check className="h-2.5 w-2.5" /> : null}
                </span>
              ))}
            </span>
            <span className={cn('text-[11px] font-medium', rejected ? 'text-red-600' : 'text-muted-foreground')}>
              {label}
            </span>
          </span>
        </TooltipTrigger>

        <TooltipContent side="left" className="max-w-xs">
          {entries.length ? (
            <ul className="space-y-1 text-xs">
              {entries.map((entry) => (
                <li key={entry.approver_user_id} className="flex items-start gap-1.5">
                  {entry.decision === 'REJECTED' ? (
                    <X className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                  ) : (
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-400" />
                  )}
                  <span>
                    {entry.approver_name}
                    {entry.created_at && (
                      <span className="opacity-70"> — {format(new Date(entry.created_at), 'dd.MM.yyyy HH:mm')}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xs">Hali hech kim ko‘rib chiqmagan</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
