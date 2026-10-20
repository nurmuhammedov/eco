import { useMemo, useState } from 'react'
import { Link2, Loader2 } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Combobox } from '@/shared/components/ui/combobox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Label } from '@/shared/components/ui/label'
import type { SkudUnmatched } from '../api/skud.api'
import { useLinkSkudPerson, useSkudPeople, useSkudUnmatched } from '../model/use-skud'
import { formatDateTime } from './skud-labels'

const LinkDialog = ({ row, onClose }: { row: SkudUnmatched | null; onClose: () => void }) => {
  const { data: people = [], isLoading } = useSkudPeople(!!row)
  const linkMutation = useLinkSkudPerson()
  const [userId, setUserId] = useState('')

  // Staff of the same region first: the terminal hangs in their office
  const options = useMemo(
    () =>
      [...people]
        .sort((a, b) => Number(b.region_id === row?.region_id) - Number(a.region_id === row?.region_id))
        .map((person) => ({
          id: person.id,
          name: `${person.name} — ${person.region_name ?? 'hudud ko‘rsatilmagan'} (${person.username})`,
        })),
    [people, row?.region_id]
  )

  const close = () => {
    setUserId('')
    onClose()
  }

  const handleSave = () => {
    if (!row || !userId) return
    linkMutation.mutate({ region_id: row.region_id, person_no: row.person_no, user_id: userId }, { onSuccess: close })
  }

  return (
    <Dialog open={!!row} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raqamni xodimga bog‘lash</DialogTitle>
        </DialogHeader>

        {row && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-md border p-3 text-sm">
              <p>
                <span className="text-muted-foreground">Hudud:</span> {row.region_name ?? '—'}
              </p>
              <p>
                <span className="text-muted-foreground">Qurilmadagi raqami:</span>{' '}
                <span className="font-mono">{row.person_no}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Qurilmadagi ismi:</span> {row.person_name ?? '—'}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Xodim *</Label>
              <Combobox
                options={options}
                value={userId}
                onChange={(value) => setUserId(String(value))}
                placeholder={isLoading ? 'Yuklanmoqda...' : 'Xodimni tanlang'}
                searchPlaceholder="F.I.Sh. yoki JSHSHIR"
                disabled={isLoading}
              />
              <p className="text-muted-foreground text-xs">
                Shu raqam bilan avval kelgan barcha hodisalar ham tanlangan xodimga bog‘lanadi.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={linkMutation.isPending}>
            Bekor qilish
          </Button>
          <Button onClick={handleSave} disabled={!userId || linkMutation.isPending}>
            {linkMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Bog‘lash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const SkudUnmatchedTab = () => {
  const { data = [], isLoading } = useSkudUnmatched()
  const [linking, setLinking] = useState<SkudUnmatched | null>(null)

  const columns: ExtendedColumnDef<SkudUnmatched, unknown>[] = [
    {
      header: 'Hudud',
      accessorKey: 'region_name',
      cell: ({ row }) => <span className="font-medium">{row.original.region_name ?? '—'}</span>,
    },
    {
      header: 'Qurilmadagi raqami',
      accessorKey: 'person_no',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.person_no}</span>,
    },
    {
      header: 'Qurilmadagi ismi',
      accessorKey: 'person_name',
      cell: ({ row }) => <span>{row.original.person_name ?? '—'}</span>,
    },
    {
      header: 'Hodisalar',
      accessorKey: 'count',
      cell: ({ row }) => <span className="font-medium">{row.original.count} ta</span>,
    },
    {
      header: 'Oxirgisi',
      accessorKey: 'last_time',
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDateTime(row.original.last_time)}</span>,
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button size="sm" variant="outline" onClick={() => setLinking(row.original)}>
          <Link2 className="mr-1.5 h-4 w-4" />
          Bog‘lash
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-auto">
      <Card>
        <CardContent className="text-muted-foreground p-4 text-sm">
          Qurilmada xodimning <b>Employee No.</b> maydoniga JSHSHIR yozilgan bo‘lsa, hodisa xodimga avtomatik
          bog‘lanadi. Boshqa raqam yozilgan bo‘lsa, u shu ro‘yxatga tushadi va bu yerda bir marta qo‘lda bog‘lanadi.
        </CardContent>
      </Card>

      <DataTable columns={columns} data={data} isLoading={isLoading} className="flex-1" />

      <LinkDialog row={linking} onClose={() => setLinking(null)} />
    </div>
  )
}
