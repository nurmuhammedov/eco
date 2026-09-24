import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'

/** Where an application was filed: the MyGov portal or this system itself */
const SOURCES: Record<string, { label: string; className: string }> = {
  MY_GOV: { label: 'MyGov', className: 'border-blue-200 bg-blue-50 text-blue-700' },
  SYSTEM: { label: 'Tizim', className: 'border-teal/30 bg-teal/10 text-teal' },
}

export const SourceTypeBadge = ({ sourceType, className }: { sourceType?: string | null; className?: string }) => {
  const source = sourceType ? SOURCES[sourceType] : undefined
  if (!source) return null

  return (
    <Badge variant="outline" className={cn('shrink-0 font-medium whitespace-nowrap', source.className, className)}>
      {source.label}
    </Badge>
  )
}
