import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

interface StatValueProps {
  value: number
  isLoading?: boolean
  className?: string
  /** Matches the rendered text so the placeholder does not change the layout. */
  skeletonClassName?: string
}

/**
 * On a safety dashboard a real zero and a not-yet-loaded zero mean very different
 * things, so nothing is rendered as a number until the value is actually known.
 */
export const StatValue = ({ value, isLoading, className, skeletonClassName }: StatValueProps) => {
  if (isLoading) return <Skeleton className={cn('h-7 w-12 bg-current/10', skeletonClassName)} />

  return <span className={className}>{value.toLocaleString()}</span>
}
