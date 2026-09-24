import { useState } from 'react'
import { format } from 'date-fns'
import { Edit2, Plus } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { deleteQuestion } from '@/entities/attestation/api/attestation.api'
import { DIRECTION, DIRECTION_OPTIONS, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationQuestion } from '@/entities/attestation/model/types'
import { AddQuestionModal } from './add-question-modal'
import { EditQuestionModal } from './edit-question-modal'

export const QuestionsList = () => {
  const queryClient = useQueryClient()
  const { paramsObject } = useCustomSearchParams()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<AttestationQuestion | null>(null)

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationQuestion>(
    SERVICES_API_ENDPOINTS.QUESTIONS,
    { ...paramsObject }
  )

  const { mutate: remove } = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      toast.success('Savol o‘chirildi')
      queryClient.invalidateQueries({ queryKey: ['services', SERVICES_API_ENDPOINTS.QUESTIONS] })
    },
  })

  const columns: ExtendedColumnDef<AttestationQuestion, unknown>[] = [
    {
      header: 'Savol matni',
      accessorKey: 'question_text',
      filterKey: 'search',
      filterType: 'search',
      cell: ({ row }) => <span className="line-clamp-2">{row.original.question_text}</span>,
    },
    {
      header: 'Yo‘nalish',
      accessorKey: 'direction',
      filterKey: 'direction',
      filterType: 'select',
      filterOptions: DIRECTION_OPTIONS.map((option) => ({ id: option.value, name: option.label })),
      cell: ({ row }) => DIRECTION[row.original.direction] ?? row.original.direction,
    },
    {
      header: 'Xodim turi',
      accessorKey: 'employee_type',
      filterKey: 'employee_type',
      filterType: 'select',
      filterOptions: [
        { id: 'LEADER', name: EMPLOYEE_TYPE.LEADER.label },
        { id: 'ENGINEER', name: EMPLOYEE_TYPE.ENGINEER.label },
      ],
      cell: ({ row }) => {
        const type = EMPLOYEE_TYPE[row.original.employee_type]

        return (
          <Badge variant="outline" className={type.className}>
            {type.label}
          </Badge>
        )
      },
    },
    {
      header: 'Holati',
      accessorKey: 'is_active',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
          {row.original.is_active ? 'Faol' : 'Nofaol'}
        </Badge>
      ),
    },
    {
      header: 'Qo‘shilgan sana',
      accessorKey: 'created_at',
      cell: ({ row }) => (row.original.created_at ? format(new Date(row.original.created_at), 'dd.MM.yyyy') : '-'),
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-orange-500"
            title="Tahrirlash"
            onClick={() => setEditingQuestion(row.original)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          <DeleteConfirmationDialog
            title="Savolni o‘chirish"
            description="Ushbu savolni o‘chirmoqchimisiz?"
            onConfirm={() => remove(row.original.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex justify-end">
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi qo‘shish
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        isPaginated
        pageCount={totalPages}
        showFilters
        className="flex-1"
      />

      <AddQuestionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditQuestionModal
        isOpen={!!editingQuestion}
        onClose={() => setEditingQuestion(null)}
        question={editingQuestion}
      />
    </div>
  )
}
