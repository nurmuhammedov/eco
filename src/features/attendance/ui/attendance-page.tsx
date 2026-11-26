import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useCustomSearchParams } from '@/shared/hooks'
import { paramNumber, paramText } from '@/shared/lib/url-params'
import type { AttendanceFilters } from '../api/attendance.api'
import { useAttendanceAccess } from '../model/use-attendance'
import { AbsencesTab } from './absences-tab'
import { ConfirmTab } from './confirm-tab'
import { HolidaysTab } from './holidays-tab'
import { LogsTable } from './logs-table'
import { PeriodToolbar } from './period-toolbar'
import { StaffTab } from './staff-tab'
import { SummaryTab } from './summary-tab'
import { TimesheetTab } from './timesheet-tab'

const VIEW_TABS = [
  { id: 'timesheet', label: 'Tabel' },
  { id: 'summary', label: 'Yig‘ma hisobot' },
  { id: 'logs', label: 'Kunlik kirish/chiqish' },
]

/** What only HR and the administrator enter */
const MANAGE_TABS = [
  { id: 'confirm', label: 'Tasdiqlash (?)' },
  { id: 'absences', label: 'Sababli yo‘qliklar' },
  { id: 'staff', label: 'Xodimlar va grafik' },
  { id: 'holidays', label: 'Bayramlar' },
]

/** The filters of one tab mean nothing on another */
const TAB_KEYS = ['page', 'size', 'date_from', 'date_to', 'status', 'late', 'search']

/**
 * Davomat: the FaceID (SKUD) events read as a timesheet. Everyone here sees the
 * reports; HR and the administrator also enter business trips, leaves,
 * holidays, schedules and the days a terminal missed.
 */
export default function AttendancePage() {
  const { canManage } = useAttendanceAccess()
  const { paramsObject, addParams } = useCustomSearchParams()

  const now = new Date()
  const tabs = canManage ? [...VIEW_TABS, ...MANAGE_TABS] : VIEW_TABS
  const tab = tabs.find((item) => item.id === paramText(paramsObject.tab))?.id ?? 'timesheet'
  const filters: AttendanceFilters = {
    year: paramNumber(paramsObject.year, now.getFullYear()),
    month: paramNumber(paramsObject.month, now.getMonth() + 1),
    division: paramText(paramsObject.division),
  }

  const change = (patch: { year?: number; month?: number; division?: string }) =>
    addParams(
      {
        ...(patch.year !== undefined ? { year: patch.year } : {}),
        ...(patch.month !== undefined ? { month: patch.month } : {}),
        ...(patch.division !== undefined ? { division: patch.division || null } : {}),
      },
      'page'
    )

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Davomat</h1>
        <PeriodToolbar
          year={filters.year}
          month={filters.month}
          division={filters.division ?? ''}
          onChange={change}
          hideMonth={tab === 'holidays'}
          hideDivision={tab === 'holidays'}
        />
      </div>

      <Tabs value={tab} onValueChange={(value) => addParams({ tab: value }, ...TAB_KEYS)}>
        <TabsList className="h-auto flex-wrap">
          {tabs.map((item) => (
            <TabsTrigger key={item.id} value={item.id}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {tab === 'timesheet' && <TimesheetTab filters={filters} />}
        {tab === 'summary' && (
          <SummaryTab filters={filters} onOpenDivision={(code) => addParams({ tab: 'timesheet', division: code })} />
        )}
        {tab === 'logs' && <LogsTable filters={filters} />}
        {tab === 'confirm' && <ConfirmTab filters={filters} />}
        {tab === 'absences' && <AbsencesTab filters={filters} />}
        {tab === 'staff' && <StaffTab division={filters.division ?? ''} />}
        {tab === 'holidays' && <HolidaysTab year={filters.year} />}
      </div>
    </div>
  )
}
