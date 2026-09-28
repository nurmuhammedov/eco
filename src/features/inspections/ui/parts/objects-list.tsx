import { useObjectListByPagination } from '@/features/inspections/hooks/use-object-list'
import useCustomSearchParams from '../../../../shared/hooks/api/use-search-params'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button'
import { Eye } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { useNavigate } from 'react-router-dom'
import { getDate } from '@/shared/utils/date'
import type { InspectionRiskAnalysis } from '@/entities/inspection/model/inspection.types'

const ObjectsList = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data, isLoading } = useObjectListByPagination()
  const navigate = useNavigate()

  const columns: ColumnDef<InspectionRiskAnalysis>[] = [
    {
      header: 'Xavf tahlil davri',
      cell: ({ row }) => `${getDate(row.original.startDate)} - ${getDate(row.original.endDate)}`,
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
            navigate(
              `/risk-analysis/objects/${row.original?.id}?tin=${paramsObject?.tin}&name=${paramsObject?.name}`,
              {}
            )
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div>
      <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} />
    </div>
  )
}

export default ObjectsList
