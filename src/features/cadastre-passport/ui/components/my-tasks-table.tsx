import { useNavigate } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { WORKFLOW_ACTION_LABELS } from '../../model/labels'
import { WorkflowInstance } from '../../model/types'

export const MyTasksTable = () => {
  const navigate = useNavigate()

  const {
    paramsObject: { page = 1, size = 10 },
  } = useCustomSearchParams()

  const { data, isLoading, totalPages } = usePaginatedData<WorkflowInstance>('/workflow-instances/my-tasks', {
    page,
    size,
    processType: 'CADASTRE_PASSPORT_REVIEW',
  })

  const columns: ExtendedColumnDef<WorkflowInstance, any>[] = [
    {
      accessorKey: 'orgName',
      header: 'Tashkilot',
      cell: ({ row }) => row.original.orgName || '-',
    },
    {
      id: 'step',
      header: 'Pog‘ona',
      cell: ({ row }) =>
        [`${row.original.currentStep} / ${row.original.totalSteps}`, row.original.currentPositionName]
          .filter(Boolean)
          .join(' · '),
    },
    {
      id: 'allowedActions',
      header: 'Kutilayotgan amallar',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.allowedActions.map((action) => (
            <Badge key={action} variant="outline">
              {WORKFLOW_ACTION_LABELS[action] ?? action}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions
            row={row}
            showView
            onView={(target) => navigate(`/cadastre-passport/${target.original.businessId}`)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      isPaginated
      data={data?.content || []}
      columns={columns as unknown as any}
      isLoading={isLoading}
      pageCount={totalPages}
      className="flex-1"
    />
  )
}
