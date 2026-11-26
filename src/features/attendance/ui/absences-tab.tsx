import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import type { AttendanceAbsence, AttendanceFilters } from '../api/attendance.api'
import { formatDate } from '../model/attendance-labels'
import { useAttendanceAbsences, useDeleteAbsence } from '../model/use-attendance'
import { AbsenceDialog } from './absence-dialog'

/** Business trips (X) and study / leave (O‘) that touch the month */
export const AbsencesTab = ({ filters }: { filters: AttendanceFilters }) => {
  const { data = [], isLoading } = useAttendanceAbsences(filters)
  const deleteMutation = useDeleteAbsence()
  const [editing, setEditing] = useState<AttendanceAbsence | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const open = (absence: AttendanceAbsence | null) => {
    setEditing(absence)
    setIsOpen(true)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Xizmat safari kun sifatida hisoblanadi (soat — 0), o‘qish / ta’til hisoblanmaydi. Oy bilan kesishgan yozuvlar
          ko‘rsatiladi.
        </p>
        <Button onClick={() => open(null)}>
          <Plus className="mr-1.5 size-4" />
          Qo‘shish
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-neutral-50">
            <tr>
              {['Xodim', 'Turi', 'Oraliq', 'Kun', 'Dam olish kunlari', 'Izoh', 'Kiritgan', ''].map((label) => (
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
            ) : !data.length ? (
              <tr>
                <td colSpan={8} className="text-muted-foreground px-2 py-4">
                  Bu oyda sababli yo‘qlik kiritilmagan
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="border px-2 py-2">
                    <p className="font-medium">{item.name ?? item.user_id}</p>
                    <p className="text-muted-foreground text-xs">{item.division_name}</p>
                  </td>
                  <td className="border px-2 py-2">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
                        item.type === 'BUSINESS_TRIP' ? 'bg-sky-50 text-sky-700' : 'bg-violet-50 text-violet-700'
                      )}
                    >
                      <b>{item.code}</b> {item.type_label}
                    </span>
                  </td>
                  <td className="border px-2 py-2 whitespace-nowrap">
                    {formatDate(item.date_from)} – {formatDate(item.date_to)}
                  </td>
                  <td className="border px-2 py-2 text-center">{item.days}</td>
                  <td className="border px-2 py-2 text-center">{item.include_weekends ? 'Ha' : 'Yo‘q'}</td>
                  <td className="border px-2 py-2 text-xs">{item.note ?? ''}</td>
                  <td className="border px-2 py-2 text-xs">{item.created_by_name ?? '—'}</td>
                  <td className="border px-2 py-2">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" aria-label="Tahrirlash" onClick={() => open(item)}>
                        <Pencil className="size-4" />
                      </Button>
                      <DeleteConfirmationDialog
                        title="Yozuv o‘chirilsinmi?"
                        description="Bu kunlar yana FaceID ma’lumotlari bo‘yicha hisoblanadi."
                        confirmText="O‘chirish"
                        onConfirm={() => deleteMutation.mutateAsync(item.id).then(() => undefined)}
                        trigger={
                          <Button size="sm" variant="ghost" aria-label="O‘chirish">
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AbsenceDialog isOpen={isOpen} onClose={() => setIsOpen(false)} absence={editing} />
    </div>
  )
}
