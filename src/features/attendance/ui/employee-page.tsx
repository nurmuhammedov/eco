import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { useCustomSearchParams } from '@/shared/hooks'
import { paramNumber } from '@/shared/lib/url-params'
import { cn } from '@/shared/lib/utils'
import type { EmployeeDay } from '../api/attendance.api'
import {
  cellClassName,
  formatDate,
  formatHours,
  INCOMPLETE_REASON_LABELS,
  STATUS_LABELS,
  todayIso,
} from '../model/attendance-labels'
import { useAttendanceAccess, useEmployeeAttendance } from '../model/use-attendance'
import { CorrectionDialog, type CorrectionTarget } from './correction-dialog'
import { PeriodToolbar } from './period-toolbar'

const Stat = ({ label, value, className }: { label: string; value: string | number; className?: string }) => (
  <div className="rounded-md border bg-white px-4 py-2">
    <p className="text-muted-foreground text-xs">{label}</p>
    <p className={cn('text-lg font-semibold', className)}>{value}</p>
  </div>
)

const statusText = (day: EmployeeDay) => {
  if (day.status === 'PRESENT' && day.late_minutes > 0) return 'Kech qolgan'
  if (day.status === 'HOLIDAY' && day.holiday) return day.holiday

  return STATUS_LABELS[day.status]
}

/**
 * One employee's month: every day with its status and the FaceID events
 * behind it, so a disputed day can be checked against what the terminals saw.
 */
export default function AttendanceEmployeePage() {
  const { userId } = useParams<{ userId: string }>()
  const { canManage } = useAttendanceAccess()
  const { paramsObject, addParams } = useCustomSearchParams()
  const [correcting, setCorrecting] = useState<CorrectionTarget | null>(null)

  const now = new Date()
  const year = paramNumber(paramsObject.year, now.getFullYear())
  const month = paramNumber(paramsObject.month, now.getMonth() + 1)
  const { data, isLoading, isError } = useEmployeeAttendance(userId, year, month)
  const today = todayIso()

  const employee = data?.employee
  const schedule = employee?.schedule

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <GoBack title={employee?.name ?? 'Xodim davomati'} fallbackPath="/attendance" />
        <PeriodToolbar
          year={year}
          month={month}
          division=""
          hideDivision
          onChange={(patch) => addParams({ ...patch })}
        />
      </div>

      {isError ? (
        <div className="text-muted-foreground rounded-md border bg-white p-6 text-sm">Xodim topilmadi.</div>
      ) : isLoading || !data || !employee || !schedule ? (
        <div className="text-muted-foreground rounded-md border bg-white p-6 text-sm">Yuklanmoqda…</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[260px] flex-1 rounded-md border bg-white px-4 py-2 text-sm">
              <p className="font-medium">{employee.division_name}</p>
              <p className="text-muted-foreground">
                {[employee.position, employee.department_name].filter(Boolean).join(' · ') || employee.role}
              </p>
              <p className="text-muted-foreground">
                Stavka {schedule.rate} · norma {schedule.daily_hours} soat · {schedule.work_start}–{schedule.work_end},
                tushlik {schedule.lunch_minutes} daq.
                {!schedule.is_tracked && <span className="text-orange-600"> · davomatdan chiqarilgan</span>}
              </p>
              <p className="text-muted-foreground">
                {employee.tracked_since
                  ? `FaceID orqali ${formatDate(employee.tracked_since)} dan qayd etilmoqda`
                  : 'FaceID orqali hali qayd etilmagan'}
              </p>
            </div>
            <Stat label="Ish kunlari" value={data.totals.days} />
            <Stat label="Soat" value={formatHours(data.totals.hours)} />
            <Stat
              label="Kech qolishlar"
              value={`${data.totals.lates} (${data.totals.late_minutes} daq.)`}
              className={data.totals.lates ? 'text-red-600' : undefined}
            />
            <Stat
              label="Sababsiz kelmagan"
              value={data.totals.absent}
              className={data.totals.absent ? 'text-red-600' : undefined}
            />
            <Stat label="Tasdiqlanmagan (?)" value={data.totals.incomplete} />
            <Stat label="Safar / ta’til" value={`${data.totals.business_trip} / ${data.totals.leave}`} />
          </div>

          <div className="min-h-0 flex-1 overflow-auto rounded-md border bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-neutral-50">
                <tr>
                  {[
                    'Sana',
                    'Holati',
                    'Kelgan',
                    'Ketgan',
                    'Ishlagan soat',
                    'Kechikish',
                    'FaceID hodisalari',
                    'Izoh',
                    '',
                  ].map((label) => (
                    <th key={label} className="border px-2 py-2 text-left font-semibold">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.days.map((day) => (
                  <tr key={day.date} className={cn(!day.is_workday && 'bg-neutral-50')}>
                    <td className="border px-2 py-1.5 whitespace-nowrap">
                      {formatDate(day.date)}{' '}
                      <span className={cn('text-xs', !day.is_workday && 'text-red-600')}>{day.weekday}</span>
                    </td>
                    <td className="border px-2 py-1.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs',
                          cellClassName(day.status, day.flag)
                        )}
                      >
                        {day.code && day.status !== 'PRESENT' && <b>{day.code}</b>}
                        {statusText(day)}
                      </span>
                      {day.incomplete_reason && (
                        <span className="block text-xs text-orange-600">
                          {INCOMPLETE_REASON_LABELS[day.incomplete_reason]}
                        </span>
                      )}
                      {day.corrected && <span className="block text-xs text-blue-600">HR tuzatgan</span>}
                    </td>
                    <td className="border px-2 py-1.5">{day.check_in ?? ''}</td>
                    <td className="border px-2 py-1.5">{day.check_out ?? ''}</td>
                    <td className="border px-2 py-1.5">{day.status === 'PRESENT' ? formatHours(day.hours) : ''}</td>
                    <td className={cn('border px-2 py-1.5', day.late_minutes > 0 && 'font-medium text-red-600')}>
                      {day.late_minutes > 0 ? `${day.late_minutes} daq.` : ''}
                    </td>
                    <td className="border px-2 py-1.5 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {day.events.map((event, index) => (
                          <span
                            key={`${event.time}-${index}`}
                            title={event.device ?? undefined}
                            className={cn(
                              'rounded px-1.5 py-0.5 font-mono',
                              event.direction === 'in'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-700'
                            )}
                          >
                            {event.direction === 'in' ? '↓' : '↑'} {event.time.slice(0, 5)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="border px-2 py-1.5 text-xs">{day.note ?? ''}</td>
                    <td className="border px-2 py-1.5 text-right">
                      {canManage && day.date <= today && day.status !== 'PENDING' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Kunni tuzatish"
                          onClick={() =>
                            setCorrecting({
                              userId: employee.id,
                              name: employee.name,
                              date: day.date,
                              status: day.status,
                              checkIn: day.check_in,
                              checkOut: day.check_out,
                            })
                          }
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <CorrectionDialog target={correcting} onClose={() => setCorrecting(null)} />
    </div>
  )
}
