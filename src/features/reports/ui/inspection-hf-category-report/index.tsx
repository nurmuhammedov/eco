import React, { useMemo } from 'react'
import { format, parseISO, startOfMonth } from 'date-fns'
import { GoBack } from '@/shared/components/common'
import { NoData } from '@/shared/components/common/no-data'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import DatePicker from '@/shared/components/ui/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useData } from '@/shared/hooks'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import { useHazardousFacilityCategoryDictionarySelect } from '@/shared/api/dictionaries'
import { cn } from '@/shared/lib/utils'

interface Row {
  regionId: number | null
  regionName: string
  totalCount: number
  riskBasedCount: number
  otherCount: number
}

const ALL = 'ALL'
const API_DATE = 'yyyy-MM-dd'

const share = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0)

const InspectionHfCategoryReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()

  // From the first of the month up to today, unless the user picks otherwise
  const startDate = String(paramsObject.startDate ?? format(startOfMonth(new Date()), API_DATE))
  const endDate = String(paramsObject.endDate ?? format(new Date(), API_DATE))
  const categoryId = String(paramsObject.categoryId ?? ALL)

  const { data: categories } = useHazardousFacilityCategoryDictionarySelect()

  const { data, isLoading } = useData<Row[]>('/reports/inspection/hf-by-category', true, {
    startDate,
    endDate,
    ...(categoryId !== ALL && { categoryId: Number(categoryId) }),
  })

  // The backend marks the country total by a null region; it is read first
  const { total, regions } = useMemo(() => {
    const rows = Array.isArray(data) ? data : []

    return { total: rows.find((row) => row.regionId === null), regions: rows.filter((row) => row.regionId !== null) }
  }, [data])

  const setDate = (key: 'startDate' | 'endDate') => (value?: Date) =>
    value && addParams({ [key]: format(value, API_DATE) })

  return (
    <div className="flex flex-col gap-3">
      <GoBack title="XICHO toifalari bo‘yicha o‘tkazilgan tekshiruvlar" fallbackPath="/reports" />

      <Card className="flex flex-wrap items-end gap-3 p-3">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Dan</span>
          <DatePicker
            value={parseISO(startDate)}
            onChange={setDate('startDate')}
            maxDate={parseISO(endDate)}
            className="w-[160px]"
            isForm={false}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs">Gacha</span>
          <DatePicker
            value={parseISO(endDate)}
            onChange={setDate('endDate')}
            minDate={parseISO(startDate)}
            className="w-[160px]"
            isForm={false}
          />
        </div>
        <div className="flex min-w-[260px] flex-1 flex-col gap-1">
          <span className="text-muted-foreground text-xs">XICHO toifasi</span>
          <Select
            value={categoryId}
            onValueChange={(value) => addParams({ categoryId: value === ALL ? undefined : value })}
          >
            <SelectTrigger className="bg-white [&>span]:truncate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-w-[min(640px,90vw)]">
              <SelectItem value={ALL}>Barcha toifalar</SelectItem>
              {(categories ?? []).map((category: { id: number; name: string }) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isLoading && <Skeleton className="h-96 w-full rounded-xl" />}

      {!isLoading && !total && regions.length === 0 && <NoData text="Ma’lumot topilmadi" />}

      {!isLoading && (total || regions.length > 0) && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <p className="text-muted-foreground text-xs">O‘tkazilgan tekshiruvlar</p>
              <p className="text-2xl font-semibold tabular-nums">{total?.totalCount ?? 0}</p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground text-xs">Xavf tahlili asosida</p>
              <p className="text-teal text-2xl font-semibold tabular-nums">
                {total?.riskBasedCount ?? 0}
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  {share(total?.riskBasedCount ?? 0, total?.totalCount ?? 0)}%
                </span>
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-muted-foreground text-xs">Boshqa turdagi</p>
              <p className="text-2xl font-semibold text-amber-600 tabular-nums">
                {total?.otherCount ?? 0}
                <span className="text-muted-foreground ml-2 text-sm font-normal">
                  {share(total?.otherCount ?? 0, total?.totalCount ?? 0)}%
                </span>
              </p>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100">
                <tr>
                  <th rowSpan={2} className="border-b px-4 py-2 text-left font-medium">
                    Hududlar
                  </th>
                  <th rowSpan={2} className="border-b border-l px-4 py-2 text-center font-medium">
                    O‘tkazilgan tekshiruvlar
                  </th>
                  <th colSpan={2} className="border-l px-4 py-1.5 text-center font-medium">
                    shundan
                  </th>
                  <th rowSpan={2} className="hidden border-b border-l px-4 py-2 text-left font-medium md:table-cell">
                    Xavf tahlili ulushi
                  </th>
                </tr>
                <tr>
                  <th className="border-t border-b border-l px-4 py-1.5 text-center font-medium">
                    xavf tahlili asosida
                  </th>
                  <th className="border-t border-b border-l px-4 py-1.5 text-center font-medium">boshqa turdagi</th>
                </tr>
              </thead>
              <tbody>
                {[...(total ? [{ ...total, regionName: 'Respublika bo‘yicha' }] : []), ...regions].map((row) => {
                  const isTotal = row.regionId === null
                  const percent = share(row.riskBasedCount, row.totalCount)

                  return (
                    <tr
                      key={row.regionId ?? 'total'}
                      className={cn('border-t', isTotal ? 'bg-teal/5 font-semibold' : 'hover:bg-muted/40')}
                    >
                      <td className="px-4 py-2">{row.regionName}</td>
                      <td className="border-l px-4 py-2 text-center tabular-nums">{row.totalCount}</td>
                      <td className="text-teal border-l px-4 py-2 text-center tabular-nums">{row.riskBasedCount}</td>
                      <td className="border-l px-4 py-2 text-center text-amber-600 tabular-nums">{row.otherCount}</td>
                      <td className="hidden border-l px-4 py-2 md:table-cell">
                        {row.totalCount > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-amber-100">
                              <div className="bg-teal h-full rounded-full" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-muted-foreground w-9 text-xs tabular-nums">{percent}%</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
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

export default InspectionHfCategoryReport
