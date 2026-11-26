import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ExportExcelButton } from '@/shared/components/common'
import { Input } from '@/shared/components/ui/input'
import { servicesApiClient } from '@/shared/api/services-api-client'
import { cn } from '@/shared/lib/utils'
import {
  ATTENDANCE_EXPORT_ENDPOINT,
  type AttendanceCell,
  type AttendanceDay,
  type AttendanceFilters,
  type TimesheetEmployee,
} from '../api/attendance.api'
import { cellClassName, describeDay, formatHours, MONTHS, todayIso } from '../model/attendance-labels'
import { useAttendanceAccess, useAttendanceSettings, useTimesheet } from '../model/use-attendance'
import { CorrectionDialog, type CorrectionTarget } from './correction-dialog'

/**
 * Days HR can decide on: any day that is over, the ones before the employee's
 * first FaceID event too (worked before their number was linked)
 */
const CORRECTABLE = new Set([
  'PRESENT',
  'BUSINESS_TRIP',
  'LEAVE',
  'ABSENT',
  'INCOMPLETE',
  'WEEKEND',
  'HOLIDAY',
  'NO_DATA',
])

const LEGEND = [
  { label: '8 / 7 / 6 / 4 — ishlagan soati', className: 'bg-white' },
  { label: 'Kech qolgan', className: 'bg-amber-200' },
  { label: 'Kech qolgan va to‘liq ishlamagan', className: 'bg-red-200' },
  { label: 'X — xizmat safari', className: 'bg-sky-50 text-sky-700' },
  { label: 'O‘ — o‘qish / ta’til', className: 'bg-violet-50 text-violet-700' },
  { label: '× — sababsiz kelmagan', className: 'bg-white text-red-600' },
  { label: '? — kirish yoki chiqish qayd etilmagan', className: 'bg-orange-100 text-orange-700' },
  { label: 'Dam olish / bayram', className: 'bg-neutral-100' },
]

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-md border bg-white px-3 py-1.5 text-sm">
    <span className="text-muted-foreground">{label}: </span>
    <span className="font-semibold">{value}</span>
  </div>
)

const DayCell = ({ cell, day, onCorrect }: { cell: AttendanceCell; day: AttendanceDay; onCorrect?: () => void }) => {
  const text = cell.status === 'PRESENT' ? formatHours(cell.hours) : cell.code

  return (
    <td
      title={describeDay(day.date, day.weekday, cell, day.holiday)}
      onClick={onCorrect}
      className={cn(
        'h-8 min-w-[30px] border border-neutral-200 px-0.5 text-center tabular-nums',
        !day.is_workday && 'bg-neutral-100',
        cellClassName(cell.status, cell.flag),
        cell.corrected && 'underline decoration-blue-500 decoration-2 underline-offset-2',
        onCorrect && 'cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400'
      )}
    >
      {text}
    </td>
  )
}

/**
 * The monthly timesheet (Davomat_Tabel): a row per employee and a column per
 * day, grouped by division, with the template's last three columns.
 */
export const TimesheetTab = ({ filters }: { filters: AttendanceFilters }) => {
  const { canManage } = useAttendanceAccess()
  const { data: settings } = useAttendanceSettings()
  const { data, isLoading, isFetching } = useTimesheet(filters)
  const [search, setSearch] = useState('')
  const [correcting, setCorrecting] = useState<CorrectionTarget | null>(null)
  const today = todayIso()

  // Searching a name is done here: the month is already loaded
  const divisions = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!data || !term) return data?.divisions ?? []

    return data.divisions
      .map((division) => ({
        ...division,
        employees: division.employees.filter((employee) => employee.name.toLowerCase().includes(term)),
      }))
      .filter((division) => division.employees.length)
  }, [data, search])

  const days = data?.days ?? []
  const columnCount = days.length + 6

  const correct = (employee: TimesheetEmployee, cell: AttendanceCell, day: AttendanceDay) =>
    canManage && CORRECTABLE.has(cell.status) && day.date <= today
      ? () =>
          setCorrecting({
            userId: employee.user_id,
            name: employee.name,
            date: day.date,
            status: cell.status,
            checkIn: cell.check_in,
            checkOut: cell.check_out,
          })
      : undefined

  let number = 0

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Xodim F.I.Sh."
            className="pl-8"
          />
        </div>
        {data && (
          <>
            <Stat label="Xodimlar" value={data.totals.employees} />
            <Stat label="Ish kunlari" value={data.totals.days} />
            <Stat label="Soat" value={formatHours(data.totals.hours)} />
            <Stat label="Kech qolishlar" value={data.totals.lates} />
            <Stat label="Sababsiz" value={data.totals.absent} />
          </>
        )}
        <div className="ml-auto">
          <ExportExcelButton
            client={servicesApiClient}
            endpoint={ATTENDANCE_EXPORT_ENDPOINT}
            fileName={`Davomat ${MONTHS[filters.month - 1]} ${filters.year}`}
            params={{ year: filters.year, month: filters.month, division: filters.division || undefined }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {LEGEND.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={cn('inline-block size-3.5 rounded-sm border border-neutral-300', item.className)} />
            {item.label}
          </span>
        ))}
        {settings && (
          <span className="text-muted-foreground">
            Ish vaqti {settings.work_start}–{settings.work_end}, tushlik {settings.lunch_start} (
            {settings.lunch_minutes} daq.)
          </span>
        )}
        {canManage && <span className="text-muted-foreground">Kunni tuzatish uchun katakni bosing</span>}
      </div>

      <div className={cn('min-h-0 flex-1 overflow-auto rounded-md border bg-white', isFetching && 'opacity-70')}>
        {isLoading ? (
          <div className="text-muted-foreground p-6 text-sm">Yuklanmoqda…</div>
        ) : !divisions.length ? (
          <div className="text-muted-foreground p-6 text-sm">Ma’lumot topilmadi</div>
        ) : (
          <table className="w-max min-w-full border-collapse text-xs">
            <thead className="sticky top-0 z-20 bg-neutral-50">
              <tr>
                <th rowSpan={2} className="sticky left-0 z-30 w-9 border bg-neutral-50 px-1">
                  №
                </th>
                <th rowSpan={2} className="sticky left-9 z-30 min-w-[210px] border bg-neutral-50 px-2 text-left">
                  Xodim
                </th>
                <th rowSpan={2} className="border px-1">
                  Stavka
                </th>
                {days.map((day) => (
                  <th
                    key={day.date}
                    title={day.holiday ?? undefined}
                    className={cn('border px-0.5', !day.is_workday && 'bg-neutral-100 text-red-600')}
                  >
                    {day.day}
                  </th>
                ))}
                <th rowSpan={2} className="border px-1">
                  Kun
                </th>
                <th rowSpan={2} className="border px-1">
                  Soat
                </th>
                <th rowSpan={2} className="border px-1">
                  Kech
                </th>
              </tr>
              <tr>
                {days.map((day) => (
                  <th
                    key={day.date}
                    className={cn('border px-0.5 font-normal', !day.is_workday && 'bg-neutral-100 text-red-600')}
                  >
                    {day.weekday}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {divisions.map((division) => (
                <Fragment key={division.code}>
                  <tr>
                    <td colSpan={columnCount} className="border bg-blue-50 px-2 py-1.5 font-semibold text-blue-900">
                      <span className="sticky left-2">
                        {division.name} ({division.employees.length} nafar xodim)
                      </span>
                    </td>
                  </tr>
                  {division.employees.map((employee) => {
                    number++

                    return (
                      <tr key={employee.user_id} className="hover:bg-blue-50/40">
                        <td className="sticky left-0 z-10 border bg-white px-1 text-center">{number}</td>
                        <td className="sticky left-9 z-10 border bg-white px-2 py-1">
                          <Link
                            to={`/attendance/employees/${employee.user_id}?year=${filters.year}&month=${filters.month}`}
                            className="font-medium text-[#0271FF] hover:underline"
                            title={employee.name}
                          >
                            {employee.short_name}
                          </Link>
                          {employee.position && (
                            <div className="text-muted-foreground max-w-[200px] truncate text-[10px]">
                              {employee.position}
                            </div>
                          )}
                        </td>
                        <td
                          className={cn(
                            'border px-1 text-center',
                            employee.rate < 1 && 'bg-amber-100 font-semibold text-amber-900'
                          )}
                        >
                          {employee.rate}
                        </td>
                        {employee.cells.map((cell, index) => (
                          <DayCell
                            key={cell.day}
                            cell={cell}
                            day={days[index]}
                            onCorrect={correct(employee, cell, days[index])}
                          />
                        ))}
                        <td className="border bg-neutral-50 px-1 text-center font-semibold">{employee.totals.days}</td>
                        <td className="border bg-neutral-50 px-1 text-center font-semibold">
                          {formatHours(employee.totals.hours)}
                        </td>
                        <td
                          className={cn(
                            'border bg-neutral-50 px-1 text-center font-semibold',
                            employee.totals.lates > 0 && 'text-red-600'
                          )}
                        >
                          {employee.totals.lates}
                        </td>
                      </tr>
                    )
                  })}
                </Fragment>
              ))}
            </tbody>
            {data && !search && (
              <tfoot className="sticky bottom-0 z-20 bg-neutral-100 font-semibold">
                <tr>
                  <td colSpan={3} className="sticky left-0 z-30 border bg-neutral-100 px-2 py-1.5">
                    Jami
                  </td>
                  {data.day_totals.map((item) => (
                    <td key={item.day} className="border px-0.5 text-center tabular-nums">
                      {item.hours ? formatHours(item.hours) : ''}
                    </td>
                  ))}
                  <td className="border px-1 text-center">{data.totals.days}</td>
                  <td className="border px-1 text-center">{formatHours(data.totals.hours)}</td>
                  <td className="border px-1 text-center">{data.totals.lates}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      <CorrectionDialog target={correcting} onClose={() => setCorrecting(null)} />
    </div>
  )
}
