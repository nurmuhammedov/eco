import { useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useServicesPaginatedData } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { AttestationDirection } from '@/entities/attestation/model/types'
import { AddDirectionModal } from './add-direction-modal'
import { EditDirectionModal } from './edit-direction-modal'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Badge } from '@/shared/components/ui/badge'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDirection } from '@/entities/attestation/api/attestation.api'
import { toast } from 'sonner'
import { format } from 'date-fns'

export const DirectionsList = () => {
  const queryClient = useQueryClient()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingDirection, setEditingDirection] = useState<AttestationDirection | null>(null)

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationDirection>(
    SERVICES_API_ENDPOINTS.DIRECTIONS,
    {}
  )

  const { mutate: remove } = useMutation({
    mutationFn: deleteDirection,
    onSuccess: () => {
      toast.success("O'chirildi")
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.DIRECTIONS] })
    },
    onError: () => {
      toast.error("O'chirishda xatolik")
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      remove(id)
    }
  }

  const columns: ExtendedColumnDef<AttestationDirection, unknown>[] = [
    {
      header: "Yo'nalish nomi",
      accessorKey: 'name',
    },
    {
      header: 'Holati',
      accessorKey: 'is_active',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
          {row.original.is_active ? 'Aktiv' : 'Nofaol'}
        </Badge>
      ),
    },
    {
      header: 'Yaratilgan sana',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        const val = row.original.created_at
        if (!val) return '-'
        return format(new Date(val), 'dd.MM.yyyy HH:mm')
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setEditingDirection(row.original)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Yo'nalishlarni boshqarish</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi qo'shish
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable columns={columns} data={data || []} isLoading={isLoading} isPaginated pageCount={totalPages} />
      </div>

      <AddDirectionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditDirectionModal
        isOpen={!!editingDirection}
        onClose={() => setEditingDirection(null)}
        direction={editingDirection}
      />
    </div>
  )
}
