import React, { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ExportExcelButton, GoBack } from '@/shared/components/common'
import { NoData } from '@/shared/components/common/no-data'
import DatePicker from '@/shared/components/ui/datepicker'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
import { useData } from '@/shared/hooks'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import { getErrorMessage } from '@/shared/lib/error-message'
import { paramText } from '@/shared/lib/url-params'
import { cn } from '@/shared/lib/utils'
import { findTypeCounts, formatCount, orderCraneRows } from './rows'
import type { CraneCountKey, CraneReportRow } from './types'

const API_DATE = 'yyyy-MM-dd'

/** Every crane type gets these six columns, under two headings */
const COLUMN_GROUPS: { title: string; columns: { key: CraneCountKey; title: string }[] }[] = [
  {
    title: 'Hozirgi kun holati',
    columns: [
      { key: 'totalCount', title: 'Jami' },
      { key: 'withPermitCount', title: 'Ruxsatnomasi mavjudlar' },
      { key: 'withoutPermitCount', title: 'Ruxsatnomasi yo‘qlar' },
    ],
  },
  {
    title: 'Bajarilgan ishlar',
    columns: [
      { key: 'registeredCount', title: 'Belgilangan davrda reyestrga qo‘shilganlar' },
      { key: 'permitAddedCount', title: 'Belgilangan davrda yangi ruxsatnoma fayli qo‘shilganlar' },
      { key: 'permitChangedCount', title: 'Belgilangan davrda ruxsatnoma fayli o‘zgartirilganlar' },
    ],
  },
]

const TYPE_COLUMNS = COLUMN_GROUPS.flatMap((group) => group.columns)

/** The regions column stays in view while the crane types scroll past it */
const PINNED = 'sticky left-0 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]'

/** Header cells after the first column: they need their left border back, which the table drops on a row's first cell */
const INNER_HEAD = 'border-b border-neutral-200 text-center first:border-l'

const CraneReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()

  // Today's work unless the user picks a period, as the backend assumes without dates
  const today = format(new Date(), API_DATE)
  const startDate = paramText(paramsObject.startDate, today)
  const endDate = paramText(paramsObject.endDate, today)

  const { data, isLoading, isError, error } = useData<CraneReportRow[]>('/reports/registry/crane', true, {
    startDate,
    endDate,
  })

  const rows = useMemo(() => orderCraneRows(data), [data])

  // The crane types are the backend's: a new type is a new group of columns, in the country row's order
  const craneTypes = rows[0]?.types ?? []

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-2 p-3">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      )
    }

    // The request has toasted the backend's message already; the table area keeps it in view
    if (isError) return <NoData text={getErrorMessage(error, 'Hisobotni yuklashda xatolik yuz berdi')} />

    if (!rows.length) return <NoData />

    return (
      <Table>
        <TableHeader className="sticky top-0 z-30 bg-neutral-100">
          <TableRow disableZebra>
            <TableHead rowSpan={3} className={cn(PINNED, 'z-40 min-w-[220px] text-center')}>
              Hududlar
            </TableHead>
            <TableHead rowSpan={3} className="min-w-[140px] border-b border-neutral-200 text-center">
              Barcha turdagi umumiy kranlar soni
            </TableHead>
            {craneTypes.map((type) => (
              <TableHead key={type.childEquipmentId} colSpan={TYPE_COLUMNS.length} className={INNER_HEAD}>
                {type.name}
              </TableHead>
            ))}
          </TableRow>
          <TableRow disableZebra>
            {craneTypes.flatMap((type) =>
              COLUMN_GROUPS.map((group) => (
                <TableHead
                  key={`${type.childEquipmentId}-${group.title}`}
                  colSpan={group.columns.length}
                  className={INNER_HEAD}
                >
                  {group.title}
                </TableHead>
              ))
            )}
          </TableRow>
          <TableRow disableZebra>
            {craneTypes.flatMap((type) =>
              TYPE_COLUMNS.map((column) => (
                <TableHead
                  key={`${type.childEquipmentId}-${column.key}`}
                  className={cn(INNER_HEAD, 'min-w-[120px] py-2 text-xs font-medium')}
                >
                  {column.title}
                </TableHead>
              ))
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => {
            const isTotal = row.regionId === null

            return (
              <TableRow key={row.regionId ?? 'total'} className={cn('group/row', isTotal && 'font-bold')}>
                <TableCell className={cn(PINNED, 'z-20 bg-white group-even/row:bg-neutral-50')}>
                  {row.regionName}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap tabular-nums">
                  {formatCount(row.totalCount)}
                </TableCell>
                {craneTypes.flatMap((type) => {
                  const counts = findTypeCounts(row, type.childEquipmentId)

                  return TYPE_COLUMNS.map((column) => (
                    <TableCell
                      key={`${type.childEquipmentId}-${column.key}`}
                      className="text-right whitespace-nowrap tabular-nums"
                    >
                      {formatCount(counts?.[column.key])}
                    </TableCell>
                  ))
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <GoBack title="Kran qurilmalari" />
        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            value={parseISO(startDate)}
            onChange={(value) => value && addParams({ startDate: format(value, API_DATE) })}
            maxDate={parseISO(endDate)}
            placeholder="dan"
            className="h-10 w-[150px] bg-white"
            isForm={false}
          />
          <DatePicker
            value={parseISO(endDate)}
            onChange={(value) => value && addParams({ endDate: format(value, API_DATE) })}
            minDate={parseISO(startDate)}
            placeholder="gacha"
            className="h-10 w-[150px] bg-white"
            isForm={false}
          />
          <ExportExcelButton
            endpoint="/reports/registry/crane/export-excel"
            params={{ startDate, endDate }}
            fileName="Kran qurilmalari"
          />
        </div>
      </div>

      <p className="text-muted-foreground text-xs">
        «Hozirgi kun holati» ustunlari joriy holatni ko‘rsatadi va sanaga bog‘liq emas; tanlangan davr faqat «Bajarilgan
        ishlar» ustunlariga ta’sir qiladi.
      </p>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">{renderTable()}</div>
    </div>
  )
}

export default CraneReport
