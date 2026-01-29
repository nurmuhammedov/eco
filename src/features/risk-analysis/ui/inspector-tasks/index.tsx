import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { GoBack } from '@/shared/components/common'
import { TabsLayout } from '@/shared/layouts'
import { useCustomSearchParams } from '@/shared/hooks'

export const RegisterEquipmentAppealList = () => {
  // const { id: equipmentId } = useParams<{ id: string }>();
  const { paramsObject, addParams } = useCustomSearchParams()
  const activeTab = paramsObject.type || 'NEW'
  const navigate = useNavigate()

  const data: any = {
    page: {
      totalElements: 10,
      page: 1,
      size: 10,
      totalPages: 1,
    },
    content: [],
  }
  // const { data } = usePaginatedData<any>('/inquiries', {
  //   ...paramsObject,
  //   belongId: equipmentId,
  //   type: activeTab !== 'ALL' ? activeTab : '',
  // });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'registryNumber',
      header: 'Roʻyxatga olish raqami',
    },
    {
      accessorKey: 'name',
      header: 'Nomi',
    },
    {
      accessorKey: 'legalName',
      header: 'Yuridik shaxs nomi',
    },
    {
      accessorKey: 'tin',
      header: 'STIR',
    },
    {
      accessorKey: 'address',
      header: 'Manzil',
    },
    {
      accessorKey: 'result',
      header: 'Xavf tahlil natijasi',
    },
    {
      accessorKey: 'actions',
      id: 'org_actions',
      header: 'Tashkilot tomonidan qilingan o‘zgarishlar',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() =>
                navigate(`/accreditations/conclusions/detail/${row.original.appealId}?id=${row.original.id}`)
              }
            />
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <div className="mb-4">
        <GoBack title="Xavf tahlili natijasi bo‘yicha mening topshiriqlarim" />
      </div>

      <TabsLayout
        activeTab={activeTab}
        tabs={[
          { id: 'NEW', name: 'Yangi' },
          { id: 'IN_PROCESS', name: 'Jarayonda' },
          { id: 'FINISHED', name: 'Yankunlangan' },
        ].map((tab) => ({
          ...tab,
          count: tab.id === 'NEW' ? (data?.page?.totalElements ?? 0) : undefined,
          // count: tab.id === activeTab ? (data?.page?.totalElements ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ type }, 'page')}
      >
        <DataTable isPaginated data={data || []} columns={columns} />
      </TabsLayout>
    </div>
  )
}

export default RegisterEquipmentAppealList
