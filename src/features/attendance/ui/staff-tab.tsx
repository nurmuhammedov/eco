import { useMemo, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import SearchInput from '@/shared/components/common/search-input/ui/search-input'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import type { AttendanceStaffRow } from '../api/attendance.api'
import { useAttendanceStaff } from '../model/use-attendance'
import { ScheduleDialog } from './schedule-dialog'

const TRACKED = { ALL: 'ALL', YES: 'YES', NO: 'NO' } as const

const formatDateTime = (value: string | null) => {
  if (!value) return '—'

  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * The staff with their rate and working hours. An employee never seen by a
 * terminal is flagged: their Employee No. is not linked yet (SKUD).
 */
export const StaffTab = ({ division }: { division: string }) => {
  const [search, setSearch] = useState('')
  const [tracked, setTracked] = useState<string>(TRACKED.ALL)
  const [editing, setEditing] = useState<AttendanceStaffRow | null>(null)
  const { data = [], isLoading } = useAttendanceStaff({ division })

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()

    return data.filter(
      (row) =>
        (!term || row.name.toLowerCase().includes(term) || row.username.startsWith(term)) &&
        (tracked === TRACKED.ALL || row.schedule.is_tracked === (tracked === TRACKED.YES))
    )
  }, [data, search, tracked])

  const unseen = data.filter((row) => !row.last_event_at).length

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-72">
          <SearchInput placeholder="F.I.Sh. yoki JSHSHIR" onChange={setSearch} />
        </div>
        <Select value={tracked} onValueChange={setTracked}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TRACKED.ALL}>Barcha xodimlar</SelectItem>
            <SelectItem value={TRACKED.YES}>Davomatga kiradiganlar</SelectItem>
            <SelectItem value={TRACKED.NO}>Davomatdan chiqarilganlar</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">
          Jami: {data.length}
          {unseen > 0 && <span className="text-orange-600"> · FaceID’da ko‘rinmaganlar: {unseen}</span>}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-neutral-50">
            <tr>
              {['Xodim', 'Bo‘linma', 'Stavka', 'Norma', 'Ish vaqti', 'Davomat', 'Oxirgi FaceID', ''].map((label) => (
                <th key={label} className="border px-2 py-2 text-left font-semibold">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-muted-foreground px-2 py-4">
                  Yuklanmoqda…
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className={cn(!row.schedule.is_tracked && 'text-muted-foreground')}>
                  <td className="border px-2 py-2">
                    <p className="font-medium">{row.name}</p>
                    <p className="text-muted-foreground text-xs">{row.position ?? row.role}</p>
                  </td>
                  <td className="border px-2 py-2 text-xs">
                    {row.division_name}
                    {row.department_name && <span className="text-muted-foreground block">{row.department_name}</span>}
                  </td>
                  <td
                    className={cn('border px-2 py-2 text-center', row.schedule.rate < 1 && 'bg-amber-50 font-semibold')}
                  >
                    {row.schedule.rate}
                  </td>
                  <td className="border px-2 py-2 text-center">{row.schedule.daily_hours} soat</td>
                  <td className="border px-2 py-2 text-xs whitespace-nowrap">
                    {row.schedule.work_start}–{row.schedule.work_end}
                    <span className="text-muted-foreground block">tushlik {row.schedule.lunch_minutes} daq.</span>
                  </td>
                  <td className="border px-2 py-2">
                    {row.schedule.is_tracked ? (
                      <Badge variant="info">Kiradi</Badge>
                    ) : (
                      <Badge variant="secondary">Chiqarilgan</Badge>
                    )}
                  </td>
                  <td className="border px-2 py-2 text-xs whitespace-nowrap">
                    {row.last_event_at ? (
                      formatDateTime(row.last_event_at)
                    ) : (
                      <span className="text-orange-600">Ko‘rinmagan</span>
                    )}
                  </td>
                  <td className="border px-2 py-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => setEditing(row)}>
                      <CalendarClock className="mr-1.5 size-3.5" />
                      Grafik
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ScheduleDialog employee={editing} onClose={() => setEditing(null)} />
    </div>
  )
}
