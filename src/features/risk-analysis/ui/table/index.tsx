import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams } from '@/shared/hooks'
import { RiskAnalysisTab } from '@/widgets/risk-analysis/types'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'

interface Props {
  data?: any
  isLoading?: boolean
}

const List: FC<Props> = ({ data = [], isLoading = false }) => {
  const navigate = useNavigate()
  const { paramsObject } = useCustomSearchParams()
  const { t } = useTranslation('common')
  const type = paramsObject.mainTab || RiskAnalysisTab.XICHO
  const handleView = (row: RiskAnalysisItem) => {
    navigate(`/risk-analysis/detail?tin=${row.legalTin}&id=${row.belongId}&type=${type}`)
  }

  const columns: ExtendedColumnDef<RiskAnalysisItem, any>[] = [
    {
      header: () => (
        <div className="whitespace-nowrap">
          Roʻyxatga olish <br /> raqami
        </div>
      ),
      accessorKey: 'registryNumber',
      className: '!w-[1%] whitespace-nowrap',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.name'),
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },

    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
      className: '!w-[1%]',
      header: () => <div className="whitespace-nowrap">Tashkilot STIR</div>,
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.address'),
      accessorKey: 'address',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      header: t('Ballar'),
      accessorKey: 'score',
      cell: ({ row }: any) => row.original?.score ?? 'Yo‘q',
      filterKey: 'score',
      className: '!w-[1%]',

      filterType: 'search',
    },
    {
      id: 'actions',
      cell: ({ row }: any) => <DataTableRowActions showView onView={() => handleView(row.original)} row={row} />,
    },
  ]

  return <DataTable showFilters={true} isPaginated data={data || []} columns={columns} isLoading={isLoading} />
}

export default List
