import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { WorkflowInstance } from '../../model/types'
import { useCadastrePassport } from '../../model/use-cadastre-passport'
import { StatusBadge } from './status-badge'

/**
 * A task only carries its passport's id, so the passport itself is fetched per
 * row - without it every row reads the same and the executor cannot tell which
 * document is waiting. The cells of one row share a query key, so they cost a
 * single request between them.
 */
const PassportCell = ({ id, field }: { id: string; field: 'requestNumber' | 'customerTin' | 'status' }) => {
  const { data, isPending } = useCadastrePassport(id)

  if (isPending) return <Skeleton className="h-4 w-24" />
  if (!data) return <EmptyValue />
  if (field === 'status') return <StatusBadge status={data.status} />

  return <>{data[field] || <EmptyValue />}</>
}

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
      id: 'requestNumber',
      header: 'Ariza raqami',
      cell: ({ row }) => <PassportCell id={row.original.businessId} field="requestNumber" />,
    },
    {
      id: 'customerTin',
      header: 'Tashkilot STIR',
      cell: ({ row }) => <PassportCell id={row.original.businessId} field="customerTin" />,
    },
    {
      id: 'passportStatus',
      header: 'Pasport holati',
      cell: ({ row }) => <PassportCell id={row.original.businessId} field="status" />,
    },
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
