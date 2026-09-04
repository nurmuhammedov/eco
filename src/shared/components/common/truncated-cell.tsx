import { FC } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { cn } from '@/shared/lib/utils'

/** Tailwind needs the class written out, so the useful depths are listed. */
const CLAMP: Record<number, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
}

interface TruncatedCellProps {
  value?: string | number | null
  /** Lines to keep before the text is cut off. */
  lines?: 1 | 2 | 3
  /** Below this length the text is short enough to need no tooltip. */
  threshold?: number
  className?: string
}

/**
 * A table cell whose value can be one item or a hundred - a park of equipment
 * lists every factory number in a single field, and left alone it stretches the
 * row to a screenful. The cell keeps a couple of lines and hands the rest to a
 * tooltip, so the table stays readable without losing anything.
 */
export const TruncatedCell: FC<TruncatedCellProps> = ({ value, lines = 2, threshold = 40, className }) => {
  const text = value === null || value === undefined || value === '' ? '' : String(value)

  if (!text) return <EmptyValue />

  const clamped = cn('break-words', CLAMP[lines], className)

  if (text.length <= threshold) return <span className={className}>{text}</span>

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn(clamped, 'cursor-help')}>{text}</span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          className="max-h-64 max-w-sm overflow-y-auto break-words whitespace-pre-wrap"
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default TruncatedCell
