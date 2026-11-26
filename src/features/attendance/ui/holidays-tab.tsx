import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import type { HolidayType } from '../api/attendance.api'
import { formatDate } from '../model/attendance-labels'
import { useAttendanceHolidays, useCreateHoliday, useDeleteHoliday } from '../model/use-attendance'

const TYPE_LABELS: Record<HolidayType, string> = {
  HOLIDAY: 'Dam olish (bayram)',
  WORKDAY: 'Ish kuni (ko‘chirilgan)',
}

/**
 * Days off on a weekday and weekend days worked instead of another day. The
 * public holidays with a fixed date are offered for the year; the movable ones
 * (the two hayit days) and the moved days are entered by hand.
 */
export const HolidaysTab = ({ year }: { year: number }) => {
  const { data, isLoading } = useAttendanceHolidays(year)
  const createMutation = useCreateHoliday()
  const deleteMutation = useDeleteHoliday()
  const [date, setDate] = useState('')
  const [type, setType] = useState<HolidayType>('HOLIDAY')
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (!date || !name.trim()) return

    createMutation.mutate(
      { date, type, name: name.trim() },
      {
        onSuccess: () => {
          setDate('')
          setName('')
        },
      }
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
      <div className="flex flex-wrap items-end gap-3 rounded-md border bg-white p-3">
        <div className="space-y-1">
          <Label htmlFor="holiday-date">Sana</Label>
          <Input
            id="holiday-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[170px]"
          />
        </div>
        <div className="space-y-1">
          <Label>Turi</Label>
          <Select value={type} onValueChange={(value) => setType(value as HolidayType)}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TYPE_LABELS) as HolidayType[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {TYPE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[240px] flex-1 space-y-1">
          <Label htmlFor="holiday-name">Nomi</Label>
          <Input
            id="holiday-name"
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={type === 'WORKDAY' ? 'Masalan: 2-yanvar o‘rniga ish kuni' : 'Masalan: Ramazon hayiti'}
          />
        </div>
        <Button onClick={handleAdd} disabled={!date || !name.trim()} loading={createMutation.isPending}>
          <Plus className="mr-1.5 size-4" />
          Qo‘shish
        </Button>
      </div>

      {!!data?.suggestions.length && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold">Belgilangan sanali bayramlar ({year}) — hali kiritilmagan</h3>
          <div className="flex flex-wrap gap-2">
            {data.suggestions.map((item) => (
              <Button
                key={item.date}
                size="sm"
                variant="outline"
                disabled={createMutation.isPending}
                onClick={() => createMutation.mutate(item)}
              >
                <Plus className="mr-1 size-3.5" />
                {formatDate(item.date)} — {item.name}
              </Button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Kiritilgan kunlar ({data?.items.length ?? 0})</h3>
        <div className="overflow-auto rounded-md border bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                {['Sana', 'Hafta kuni', 'Turi', 'Nomi', 'Kiritgan', ''].map((label) => (
                  <th key={label} className="border px-2 py-2 text-left font-semibold">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-muted-foreground px-2 py-4">
                    Yuklanmoqda…
                  </td>
                </tr>
              ) : !data?.items.length ? (
                <tr>
                  <td colSpan={6} className="text-muted-foreground px-2 py-4">
                    {year}-yil uchun kun kiritilmagan
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-2 py-2">{formatDate(item.date)}</td>
                    <td className="border px-2 py-2">{item.weekday}</td>
                    <td className="border px-2 py-2">
                      <span
                        className={cn(
                          'rounded-md border px-2 py-0.5 text-xs',
                          item.type === 'HOLIDAY' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        )}
                      >
                        {TYPE_LABELS[item.type]}
                      </span>
                    </td>
                    <td className="border px-2 py-2">{item.name}</td>
                    <td className="border px-2 py-2 text-xs">{item.created_by_name ?? '—'}</td>
                    <td className="border px-2 py-2 text-right">
                      <DeleteConfirmationDialog
                        title="Kun o‘chirilsinmi?"
                        description={`${formatDate(item.date)} — ${item.name}`}
                        confirmText="O‘chirish"
                        onConfirm={() => deleteMutation.mutateAsync(item.id).then(() => undefined)}
                        trigger={
                          <Button size="sm" variant="ghost" aria-label="O‘chirish">
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
