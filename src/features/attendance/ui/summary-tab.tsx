import { ExportExcelButton } from '@/shared/components/common'
import { servicesApiClient } from '@/shared/api/services-api-client'
import { cn } from '@/shared/lib/utils'
import { ATTENDANCE_EXPORT_ENDPOINT, type AttendanceFilters, type SummaryRow } from '../api/attendance.api'
import { DISCIPLINE_CLASS, formatHours, MONTHS } from '../model/attendance-labels'
import { useAttendanceSummary } from '../model/use-attendance'

const COLUMNS = [
  'Kod',
  'Bo‘linma',
  'Xodimlar',
  'Ish kunlari',
  'Ish soatlari',
  'Kech qolishlar',
  'O‘rtacha soat / xodim',
  'Kech qolish / xodim',
  'Intizom holati',
  'Sababsiz kelmagan',
  'Tasdiqlanmagan (?)',
]

const Cells = ({ row }: { row: SummaryRow }) => (
  <>
    <td className="border px-2 py-2 text-center">{row.employees}</td>
    <td className="border px-2 py-2 text-center">{row.days}</td>
    <td className="border px-2 py-2 text-center">{formatHours(row.hours)}</td>
    <td className={cn('border px-2 py-2 text-center', row.lates > 0 && 'text-red-600')}>{row.lates}</td>
    <td className="border px-2 py-2 text-center">{row.avg_hours.toFixed(1)}</td>
    <td className="border px-2 py-2 text-center">{row.lates_per_employee.toFixed(2)}</td>
    <td className="border px-2 py-2 text-center">
      {row.discipline ? (
        <span
          className={cn(
            'inline-block rounded-md border px-2 py-0.5 text-xs font-medium',
            DISCIPLINE_CLASS[row.discipline.key]
          )}
        >
          {row.discipline.label}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </td>
    <td className="border px-2 py-2 text-center">{row.absent_days}</td>
    <td className={cn('border px-2 py-2 text-center', row.incomplete_days > 0 && 'font-semibold text-orange-600')}>
      {row.incomplete_days}
    </td>
  </>
)

/**
 * The summary by division (Umumiy_Hisobot). A division opens its timesheet.
 */
export const SummaryTab = ({
  filters,
  onOpenDivision,
}: {
  filters: AttendanceFilters
  onOpenDivision: (code: string) => void
}) => {
  const { data, isLoading } = useAttendanceSummary(filters)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-muted-foreground text-sm">
          Intizom holati kech qolish / xodim bo‘yicha: ≤ 1 — yaxshi, ≤ 2,5 — o‘rtacha, undan ko‘p — nazorat zarur.
        </p>
        <div className="ml-auto">
          <ExportExcelButton
            client={servicesApiClient}
            endpoint={ATTENDANCE_EXPORT_ENDPOINT}
            fileName={`Davomat ${MONTHS[filters.month - 1]} ${filters.year}`}
            params={{ year: filters.year, month: filters.month, division: filters.division || undefined }}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border bg-white">
        {isLoading || !data ? (
          <div className="text-muted-foreground p-6 text-sm">Yuklanmoqda…</div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-neutral-50">
              <tr>
                {COLUMNS.map((label) => (
                  <th key={label} className="border px-2 py-2 text-center font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr
                  key={row.code}
                  className="cursor-pointer hover:bg-blue-50/50"
                  onClick={() => row.code && onOpenDivision(row.code)}
                  title="Tabelni ochish"
                >
                  <td className="border px-2 py-2 text-center font-mono">{row.code}</td>
                  <td className="border px-2 py-2 font-medium text-[#0271FF]">{row.name}</td>
                  <Cells row={row} />
                </tr>
              ))}
            </tbody>
            <tfoot className="sticky bottom-0 bg-neutral-100 font-semibold">
              <tr>
                <td colSpan={2} className="border px-2 py-2">
                  Jami ({data.rows.length} ta bo‘linma)
                </td>
                <Cells row={data.total} />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  )
}
