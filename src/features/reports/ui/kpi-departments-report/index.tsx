import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuarter, subQuarters } from 'date-fns'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { GoBack } from '@/shared/components/common'
import { NoData } from '@/shared/components/common/no-data'
import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import { servicesApiClient } from '@/shared/api/services-api-client'
import { cn } from '@/shared/lib/utils'
import { completionColor, KPI_CALCULATION_TYPE, KPI_RESULT_STATUS, KPI_TASK_STATUS } from '@/entities/kpi/model/status'
import type { KpiCalculationType, KpiResultStatus, KpiTaskStatus } from '@/entities/kpi/model/types'

interface ReportIndicator {
  indicator_name: string
  calculation_type: KpiCalculationType
  target: number | null
  weight: number
  achieved_value: number | null
  completion_percent: number
  score: number
  status: KpiResultStatus | 'NOT_SUBMITTED'
  note: string | null
  reviewed_by_name: string | null
}

interface ReportRow {
  kpi_department_id: string
  department_name: string
  responsible_name: string | null
  total_weight: number
  kpi_score: number
  status: KpiTaskStatus
  status_text: string
  status_comment: string
  indicators: ReportIndicator[]
}

const REPORT_ENDPOINT = '/kpi/report'

const QUARTERS = ['1', '2', '3', '4']

// The report starts with the first quarter KPI was run in
const FIRST_YEAR = 2026
const YEARS = Array.from({ length: Math.max(FIRST_YEAR, new Date().getFullYear()) - FIRST_YEAR + 1 }, (_, index) =>
  String(FIRST_YEAR + index)
)

/**
 * Departments' KPI for one quarter. The server decides the scope: the chairman
 * and the approvers get every department, any other head only their own.
 */
const KpiDepartmentsReport: React.FC = () => {
  const previousQuarter = subQuarters(new Date(), 1)
  const { paramsObject, addParams } = useCustomSearchParams()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const year = String(paramsObject.year ?? Math.max(FIRST_YEAR, previousQuarter.getFullYear()))
  const quarter = String(paramsObject.quarter ?? getQuarter(previousQuarter))

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ['services', REPORT_ENDPOINT, year, quarter],
    queryFn: async () => {
      const response = await servicesApiClient.get<{ data: ReportRow[] }>(REPORT_ENDPOINT, {
        year: Number(year),
        quarter: Number(quarter),
      })

      return response.data.data
    },
  })

  const average = rows.length ? rows.reduce((sum, row) => sum + row.kpi_score, 0) / rows.length : 0

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)

      return next
    })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <GoBack title="Bo‘limlarning KPI ko‘rsatkichi" fallbackPath="/reports" />

        <div className="flex gap-2">
          <Select value={year} onValueChange={(value) => addParams({ year: value })}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}-yil
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={quarter} onValueChange={(value) => addParams({ quarter: value })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUARTERS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}-chorak
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && <Skeleton className="h-64 w-full rounded-xl" />}

      {!isLoading && rows.length === 0 && <NoData text="Tanlangan chorak uchun KPI vazifasi topilmadi" />}

      {!isLoading && rows.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <p className="text-muted-foreground text-xs">Bo‘limlar</p>
              <p className="text-2xl font-semibold">{rows.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground text-xs">O‘rtacha KPI</p>
              <p className={cn('text-2xl font-semibold', completionColor(average))}>{average.toFixed(1)}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground text-xs">Tasdiqlangan</p>
              <p className="text-2xl font-semibold">
                {rows.filter((row) => row.status === 'APPROVED').length} / {rows.length}
              </p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 text-left">
                <tr>
                  <th className="w-10 px-3 py-2" />
                  <th className="px-3 py-2 font-medium">Bo‘lim</th>
                  <th className="px-3 py-2 font-medium">Mas’ul</th>
                  <th className="px-3 py-2 text-center font-medium">KPI</th>
                  <th className="px-3 py-2 font-medium">Holati</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isOpen = expanded.has(row.kpi_department_id)
                  const status = KPI_TASK_STATUS[row.status]

                  return (
                    <React.Fragment key={row.kpi_department_id}>
                      <tr
                        className="hover:bg-muted/40 cursor-pointer border-t"
                        onClick={() => toggle(row.kpi_department_id)}
                      >
                        <td className="px-3 py-2">
                          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </td>
                        <td className="px-3 py-2 font-medium">{row.department_name}</td>
                        <td className="px-3 py-2">{row.responsible_name || '-'}</td>
                        <td className={cn('px-3 py-2 text-center font-semibold', completionColor(row.kpi_score))}>
                          {row.kpi_score}%
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={status?.variant ?? 'secondary'}>{status?.label ?? row.status_text}</Badge>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr className="bg-muted/20 border-t">
                          <td />
                          <td colSpan={4} className="px-3 py-3">
                            <p className="text-muted-foreground mb-2 text-xs">{row.status_comment}</p>
                            <table className="w-full text-xs">
                              <thead className="text-muted-foreground text-left">
                                <tr>
                                  <th className="py-1 pr-2 font-medium">Ko‘rsatkich</th>
                                  <th className="py-1 pr-2 font-medium">Turi</th>
                                  <th className="py-1 pr-2 text-center font-medium">Reja</th>
                                  <th className="py-1 pr-2 text-center font-medium">Erishilgan</th>
                                  <th className="py-1 pr-2 text-center font-medium">Bajarilish</th>
                                  <th className="py-1 pr-2 text-center font-medium">Ball / vazn</th>
                                  <th className="py-1 font-medium">Holati</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.indicators.map((indicator, index) => {
                                  const result =
                                    indicator.status === 'NOT_SUBMITTED' ? null : KPI_RESULT_STATUS[indicator.status]

                                  return (
                                    <tr key={index} className="border-t">
                                      <td className="py-1.5 pr-2">{indicator.indicator_name}</td>
                                      <td className="py-1.5 pr-2">
                                        {KPI_CALCULATION_TYPE[indicator.calculation_type]?.short ??
                                          indicator.calculation_type}
                                      </td>
                                      <td className="py-1.5 pr-2 text-center">{indicator.target ?? '-'}</td>
                                      <td className="py-1.5 pr-2 text-center">{indicator.achieved_value ?? '-'}</td>
                                      <td className="py-1.5 pr-2 text-center">{indicator.completion_percent}%</td>
                                      <td className="py-1.5 pr-2 text-center">
                                        {indicator.score} / {indicator.weight}
                                      </td>
                                      <td className="py-1.5">
                                        {result ? (
                                          <Badge variant={result.variant}>{result.label}</Badge>
                                        ) : (
                                          <span className="text-muted-foreground">Topshirilmagan</span>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  )
}

export default KpiDepartmentsReport
