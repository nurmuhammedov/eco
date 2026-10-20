import React, { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronRight, FileText } from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import { isReportReady, reportGroupUrl, useReportGroups } from '../../model/reports-catalog'

/**
 * One section of the reports, picked in the sidebar under "Hisobotlar". The
 * bare /reports address opens the first section the role has.
 */
export const ReportsGrid: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>()
  const groups = useReportGroups()
  const [filterType, setFilterType] = useState<string>('ALL')

  const group = groups.find((item) => item.id === groupId)

  const items = useMemo(
    () => (group?.items ?? []).filter((item) => filterType === 'ALL' || item.reportType === filterType),
    [group, filterType]
  )

  if (!group) {
    return groups.length ? <Navigate to={reportGroupUrl(groups[0].id)} replace /> : null
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">Hisobotlar</p>
          <h5 className="text-xl font-semibold text-gray-800 sm:text-2xl">{group.title}</h5>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Barchasi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Barchasi</SelectItem>
            <SelectItem value="MONTHLY">Oylik hisobotlar</SelectItem>
            <SelectItem value="OTHERS">Boshqa turdagi hisobotlar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {items.length === 0 ? (
        <Card className="text-muted-foreground border-none p-8 text-center text-sm shadow-sm">
          Bu bo‘limda tanlangan turdagi hisobot yo‘q.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon || FileText
            const ready = isReportReady(item)

            const body = (
              <>
                <div
                  className={cn(
                    'shrink-0 rounded-md p-2.5 transition-colors',
                    ready
                      ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                      : 'bg-gray-50 text-gray-400'
                  )}
                >
                  <Icon size={20} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className={cn('text-sm leading-snug font-medium', ready ? 'text-gray-800' : 'text-gray-400')}>
                    {item.title}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      {item.reportType === 'MONTHLY' ? 'Oylik' : 'Boshqa'}
                    </span>
                    {item.badge && (
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase',
                          item.badge === 'Jarayonda' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
                {ready && (
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
                )}
              </>
            )

            const className = 'group flex items-start gap-3 rounded-lg border bg-white p-4 shadow-xs transition-all'

            return ready ? (
              <Link key={item.id} to={item.url} className={cn(className, 'hover:border-blue-200 hover:shadow-md')}>
                {body}
              </Link>
            ) : (
              // Not built yet: shown so it is known to be coming, but nothing to open
              <div key={item.id} className={cn(className, 'cursor-not-allowed')} title="Ishlab chiqish jarayonida">
                {body}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

ReportsGrid.displayName = 'ReportsGrid'

export default React.memo(ReportsGrid)
