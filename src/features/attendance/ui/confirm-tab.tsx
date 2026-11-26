import { Trash2 } from 'lucide-react'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { Button } from '@/shared/components/ui/button'
import type { AttendanceFilters } from '../api/attendance.api'
import { CORRECTION_STATUS_LABELS, formatDate } from '../model/attendance-labels'
import { useAttendanceCorrections, useDeleteCorrection } from '../model/use-attendance'
import { LogsTable } from './logs-table'

/**
 * HR's queue: the days a terminal saw an entry but no exit (or the other way
 * round), and below them what HR has already decided this month.
 */
export const ConfirmTab = ({ filters }: { filters: AttendanceFilters }) => {
  const { data: corrections = [], isLoading } = useAttendanceCorrections(filters)
  const deleteMutation = useDeleteCorrection()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Tasdiqlash kerak bo‘lgan kunlar (?)</h3>
        <LogsTable filters={filters} status="INCOMPLETE" actionLabel="Tasdiqlash" />
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Kiritilgan tuzatishlar ({corrections.length})</h3>
        <div className="overflow-auto rounded-md border bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                {['Sana', 'Xodim', 'Holati', 'Kelgan – ketgan', 'Sababi', 'Kiritgan', ''].map((label) => (
                  <th key={label} className="border px-2 py-2 text-left font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-muted-foreground px-2 py-4">
                    Yuklanmoqda…
                  </td>
                </tr>
              ) : !corrections.length ? (
                <tr>
                  <td colSpan={7} className="text-muted-foreground px-2 py-4">
                    Bu oyda tuzatish kiritilmagan
                  </td>
                </tr>
              ) : (
                corrections.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-2 whitespace-nowrap">{formatDate(item.date)}</td>
                    <td className="border px-2 py-2">
                      <p className="font-medium">{item.name ?? item.user_id}</p>
                      <p className="text-muted-foreground text-xs">{item.division_name}</p>
                    </td>
                    <td className="border px-2 py-2">{CORRECTION_STATUS_LABELS[item.status]}</td>
                    <td className="border px-2 py-2 whitespace-nowrap">
                      {item.check_in || item.check_out ? `${item.check_in ?? '—'} – ${item.check_out ?? '—'}` : '—'}
                    </td>
                    <td className="border px-2 py-2">{item.reason}</td>
                    <td className="border px-2 py-2 text-xs">{item.created_by_name ?? '—'}</td>
                    <td className="border px-2 py-2 text-right">
                      <DeleteConfirmationDialog
                        title="Tuzatish o‘chirilsinmi?"
                        description="Kun yana FaceID ma’lumotlari bo‘yicha hisoblanadi."
                        confirmText="O‘chirish"
                        onConfirm={() => deleteMutation.mutateAsync(item.id).then(() => undefined)}
                        trigger={
                          <Button size="sm" variant="ghost" aria-label="Tuzatishni bekor qilish">
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
