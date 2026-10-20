import { useState } from 'react'
import { Copy, Edit2, KeyRound, Loader2, Plus, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import type { SkudDevice } from '../api/skud.api'
import {
  useDeleteSkudDevice,
  useRegenerateSkudToken,
  useSetupSkudDevices,
  useSkudDevices,
  useSkudRegions,
} from '../model/use-skud'
import { SkudDeviceModal } from './skud-device-modal'
import { DIRECTION_BADGE, DIRECTION_LABELS, formatDateTime } from './skud-labels'

const copy = async (text?: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Manzil nusxalandi.')
  } catch {
    toast.error('Nusxalab bo‘lmadi, manzilni qo‘lda belgilang.')
  }
}

export const SkudDevicesTab = () => {
  const { data: regions = [], isLoading: isLoadingRegions } = useSkudRegions()
  const { data: devices = [], isLoading: isLoadingDevices } = useSkudDevices()

  const setupMutation = useSetupSkudDevices()
  const deleteMutation = useDeleteSkudDevice()
  const tokenMutation = useRegenerateSkudToken()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<SkudDevice | null>(null)

  const missing = regions.reduce((sum, region) => sum + region.devices.in.free + region.devices.out.free, 0)

  const columns: ExtendedColumnDef<SkudDevice, unknown>[] = [
    {
      header: 'Hudud',
      accessorKey: 'region_name',
      cell: ({ row }) => <span className="font-medium">{row.original.region_name ?? '—'}</span>,
    },
    {
      header: 'Nomi',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate">{row.original.name ?? '—'}</p>
          {row.original.location && <p className="text-muted-foreground truncate text-xs">{row.original.location}</p>}
        </div>
      ),
    },
    {
      header: 'Yo‘nalishi',
      accessorKey: 'direction',
      cell: ({ row }) => (
        <Badge variant={DIRECTION_BADGE[row.original.direction]}>{DIRECTION_LABELS[row.original.direction]}</Badge>
      ),
    },
    {
      header: 'Holati',
      accessorKey: 'is_active',
      cell: ({ row }) =>
        row.original.is_active ? <Badge variant="success">Faol</Badge> : <Badge variant="error">O‘chirilgan</Badge>,
    },
    {
      header: 'Qurilma bilan aloqa',
      accessorKey: 'last_seen_at',
      cell: ({ row }) => {
        const device = row.original

        // A device that has never called in has not been configured yet
        if (!device.last_seen_at) return <span className="text-muted-foreground text-sm">Hali ulanmagan</span>

        return (
          <div className="text-sm">
            <p>{formatDateTime(device.last_seen_at)}</p>
            <p className="text-muted-foreground text-xs">
              {[device.device_name, device.last_ip].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
        )
      },
    },
    {
      header: 'Bugun',
      accessorKey: 'today_events',
      cell: ({ row }) => <span className="font-medium">{row.original.today_events} ta</span>,
    },
    {
      header: 'Qurilma manzili (push URL)',
      accessorKey: 'push_url',
      cell: ({ row }) =>
        row.original.push_url ? (
          <div className="flex max-w-[260px] items-center gap-1">
            <code className="bg-muted truncate rounded px-1.5 py-0.5 text-xs" title={row.original.push_url}>
              {row.original.push_url}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              title="Nusxalash"
              onClick={() => copy(row.original.push_url)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          '—'
        ),
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const device = row.original

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-orange-500"
              title="Tahrirlash"
              onClick={() => {
                setEditItem(device)
                setIsModalOpen(true)
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <DeleteConfirmationDialog
              title="Yangi manzil yaratish"
              description="Eski manzil darhol ishlamay qoladi. Qurilmaning o‘zida (HTTP Listening) yangi manzilni kiritish kerak bo‘ladi."
              confirmText="Yangi manzil yaratish"
              loadingText="Yaratilmoqda..."
              icon={<KeyRound className="size-5" />}
              onConfirm={() => tokenMutation.mutateAsync(device.id).then(() => undefined)}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Yangi manzil yaratish">
                  <KeyRound className="h-4 w-4" />
                </Button>
              }
            />

            <DeleteConfirmationDialog
              title="Qurilmani o‘chirish"
              description="Qurilma o‘chiriladi. Undan kelgan hodisalar o‘z hududida saqlanib qoladi."
              onConfirm={() => deleteMutation.mutateAsync(device.id).then(() => undefined)}
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-3 overflow-auto">
      {isLoadingRegions ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-muted-foreground text-sm">
                Har bir hududda kirish va chiqish uchun alohida FaceID qurilma bo‘ladi: Toshkent shahrida 2 + 2, qolgan
                hududlarda 1 + 1.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setupMutation.mutate(undefined)}
                  disabled={missing === 0 || setupMutation.isPending}
                  title={missing === 0 ? 'Barcha hududlarda qurilmalar to‘liq' : undefined}
                >
                  {setupMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Yetishmayotganlarni qo‘shish{missing > 0 && ` (${missing})`}
                </Button>
                <Button
                  onClick={() => {
                    setEditItem(null)
                    setIsModalOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Qurilma qo‘shish
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {regions.map((region) => {
                const isComplete = region.devices.in.free === 0 && region.devices.out.free === 0

                return (
                  <div
                    key={region.id}
                    className={cn(
                      'rounded-md border px-2.5 py-1.5 text-xs',
                      isComplete ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                    )}
                  >
                    <p className="font-medium">{region.name}</p>
                    <p className="text-muted-foreground">
                      Kirish {region.devices.in.count}/{region.devices.in.limit} · Chiqish {region.devices.out.count}/
                      {region.devices.out.limit}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <DataTable columns={columns} data={devices} isLoading={isLoadingDevices} className="flex-1" />

      <SkudDeviceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditItem(null)
        }}
        regions={regions}
        device={editItem}
      />
    </div>
  )
}
