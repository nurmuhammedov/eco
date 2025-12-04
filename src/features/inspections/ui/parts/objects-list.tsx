import { useObjectListByPagination } from '@/features/inspections/hooks/use-object-list.ts'
import useCustomSearchParams from '../../../../shared/hooks/api/useSearchParams.ts'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button.tsx'
import { Eye } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { useNavigate } from 'react-router-dom'
import { formatDate } from 'date-fns'

const ObjectsList = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data, isLoading } = useObjectListByPagination()
  const navigate = useNavigate()

  const columns: ColumnDef<any>[] = [
    {
      header: 'Xavf tahlil davri',
      cell: ({ row }) =>
        `${formatDate(row.original.startDate, 'dd.MM.yyyy')} - ${formatDate(row.original.endDate, 'dd.MM.yyyy')}`,
    },
    {
      header: 'Nomi',
      accessorKey: 'name',
    },
    {
      header: 'Ro‘yxatga olish raqami',
      accessorKey: 'registryNumber',
    },
    {
      header: 'Manzil',
      accessorKey: 'address',
    },
    {
      header: 'Jami bali',
      accessorKey: 'totalScore',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(`/risk-analysis/info/${row.original?.id}?tin=${paramsObject?.tin}&name=${paramsObject?.name}`, {})
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} isLoading={isLoading} />
    </div>
  )
}

export default ObjectsList
