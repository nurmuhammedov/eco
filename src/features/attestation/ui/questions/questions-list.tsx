import { useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { AttestationDirection, AttestationQuestion } from '@/entities/attestation/model/types'
import { AddQuestionModal } from './add-question-modal'
import { EditQuestionModal } from './edit-question-modal'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Badge } from '@/shared/components/ui/badge'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteQuestion } from '@/entities/attestation/api/attestation.api'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { servicesApiClient } from '@/shared/api/services-api-client'

export const QuestionsList = () => {
  const queryClient = useQueryClient()
  const { paramsObject } = useCustomSearchParams()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<AttestationQuestion | null>(null)

  const { data: directionsRes } = useQuery({
    queryKey: ['directions-list-filters'],
    queryFn: () =>
      servicesApiClient.getWithPagination<AttestationDirection>(SERVICES_API_ENDPOINTS.DIRECTIONS, { size: 100 }),
  })

  const directions: AttestationDirection[] = Array.isArray(directionsRes?.data)
    ? directionsRes.data
    : (directionsRes?.data as any)?.content || (directionsRes?.data as any)?.items || []

  const directionOptions = directions.map((d) => ({
    id: d.id,
    name: d.name,
  }))

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationQuestion>(
    SERVICES_API_ENDPOINTS.QUESTIONS,
    {
      ...paramsObject,
    }
  )

  const { mutate: remove } = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      toast.success("O'chirildi")
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.QUESTIONS] })
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

  const columns: ExtendedColumnDef<AttestationQuestion, unknown>[] = [
    {
      header: 'Savol matni',
      accessorKey: 'question_text',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: "Yo'nalish",
      accessorKey: 'attestation_direction_id',
      filterKey: 'direction_id',
      filterType: 'select',
      filterOptions: directionOptions,
      cell: ({ row }) => {
        const dir = directions.find((d) => d.id === row.original.attestation_direction_id)
        return dir ? dir.name : row.original.attestation_direction_id
      },
    },
    {
      header: 'Xodim turi',
      accessorKey: 'employee_type',
      filterKey: 'employee_type',
      filterType: 'select',
      filterOptions: [
        { id: 'LEADER', name: 'LEADER' },
        { id: 'ENGINEER', name: 'ENGINEER' },
      ],
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
          <Button variant="ghost" size="icon" onClick={() => setEditingQuestion(row.original)}>
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
        <h2 className="text-xl font-bold">Imtihon savollarini boshqarish</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi qo'shish
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <DataTable
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          isPaginated
          pageCount={totalPages}
          showFilters={true}
        />
      </div>

      <AddQuestionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditQuestionModal
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        question={editingQuestion}
      />
    </div>
  )
}
