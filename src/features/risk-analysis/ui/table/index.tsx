import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types'
import { UserRoles } from '@/entities/user'
import { AssignInspectorModal } from '@/features/risk-analysis/ui/modals/assign-inspector-modal'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useCurrentRole, useCustomSearchParams } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { AssignedStatusTab, RiskAnalysisTab } from '@/widgets/risk-analysis/types'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AssignInspectorButton } from '../assign-inspector-button'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'

interface Props {
  data?: any
  isLoading?: boolean
}

const List: FC<Props> = ({ data = [], isLoading = false }) => {
  const currentRole = useCurrentRole()
  const isRegional = currentRole === UserRoles.REGIONAL
  const { user } = useAuth()
  const navigate = useNavigate()
  const { paramsObject, addParams } = useCustomSearchParams()
  const activeAssignedStatus = (paramsObject.assignedStatus as AssignedStatusTab) || AssignedStatusTab.NOT_ASSIGNED
  const { t } = useTranslation('common')
  const type = paramsObject.mainTab || RiskAnalysisTab.XICHO

  const handleAssignedStatusChange = (status: string) => {
    addParams({ assignedStatus: status, page: 1 })
  }

  const handleView = (row: RiskAnalysisItem) => {
    navigate(`/risk-analysis/detail?tin=${row.legalTin}&id=${row.id}&type=${type}`)
  }

  const columns: ExtendedColumnDef<RiskAnalysisItem, any>[] = [
    {
      header: t('risk_analysis_columns.registryNumber'),
      accessorKey: 'registryNumber',
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
      header: t('risk_analysis_columns.legalName'),
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.legalTin'),
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
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
      cell: ({ row }: any) => row.original?.score ?? "Yo'q",
      filterKey: 'score',
      filterType: 'search',
    },
    ...(activeAssignedStatus === AssignedStatusTab.NOT_ASSIGNED && user?.role == UserRoles.REGIONAL
      ? [
          {
            id: 'assignInspector',
            header: 'Inspektorni belgilash',
            cell: ({ row }: any) => <AssignInspectorButton disabled={!!paramsObject?.intervalId} row={row.original} />,
            meta: {
              className: 'w-[200px]',
            },
          },
        ]
      : []),
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => <DataTableRowActions showView onView={() => handleView(row.original)} row={row} />,
    },
  ]

  const assignedStatusTabs = [
    { id: AssignedStatusTab.NOT_ASSIGNED, label: t('risk_analysis_tabs.NOT_ASSIGNED') },
    { id: AssignedStatusTab.ASSIGNED, label: t('risk_analysis_tabs.ASSIGNED') },
  ]

  return (
    <div>
      {isRegional && (
        <Tabs value={activeAssignedStatus} onValueChange={handleAssignedStatusChange} className="mb-4">
          <TabsList>
            {assignedStatusTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <DataTable
        showFilters={true}
        isPaginated
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        className={user?.role == UserRoles.REGIONAL ? 'h-[calc(100svh-380px)]' : 'h-[calc(100svh-320px)]'}
      />
      <AssignInspectorModal />
    </div>
  )
}

export default List
