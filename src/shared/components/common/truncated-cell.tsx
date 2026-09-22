import { FC } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
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
  /**
   * Opens the full text on click instead of on hover. Worth it where the value
   * runs to paragraphs - an enquiry, a comment - because the reader can scroll
   * it, select it and copy it, none of which a tooltip allows.
   */
  expandable?: boolean
}

/**
 * A table cell whose value can be one item or a hundred - a park of equipment
 * lists every factory number in a single field, and left alone it stretches the
 * row to a screenful. The cell keeps a couple of lines and hands the rest to a
 * tooltip, so the table stays readable without losing anything.
 */
export const TruncatedCell: FC<TruncatedCellProps> = ({
  value,
  lines = 2,
  threshold = 40,
  className,
  expandable = false,
}) => {
  const text = value === null || value === undefined || value === '' ? '' : String(value)

  if (!text) return <EmptyValue />

  const clamped = cn('break-words', CLAMP[lines], className)

  if (text.length <= threshold) return <span className={className}>{text}</span>

  if (expandable) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="To‘liq matnni ochish"
            className={cn(clamped, 'cursor-pointer text-left hover:underline')}
          >
            {text}
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="start"
          className="max-h-80 w-[min(28rem,90vw)] overflow-y-auto text-sm break-words whitespace-pre-wrap"
        >
          {text}
        </PopoverContent>
      </Popover>
    )
  }

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
