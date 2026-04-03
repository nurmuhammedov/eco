import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

const Report11: React.FC = () => {
  const tableData = React.useMemo(() => {
    return [
      {
        isSummary: true,
        officeName: 'Respublika bo‘yicha',
        x_total: 12,
        x_not_completed: 1,
        x_in_process: 4,
        x_completed: 7,
        q_total: 15,
        q_not_completed: 0,
        q_in_process: 5,
        q_completed: 10,
      },
      // Mock data...
    ]
  }, [])

  const columns: ColumnDef<any>[] = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.officeName}</span>
      ),
    },
    {
      header: 'XICHO',
      columns: [
        { header: 'Umumiy', accessorKey: 'x_total' },
        { header: 'Amal bajarilmaganlar', accessorKey: 'x_not_completed' },
        { header: 'Jarayonda', accessorKey: 'x_in_process' },
        { header: 'Yakunlandi', accessorKey: 'x_completed' },
      ],
    },
    {
      header: 'Qurilmalar',
      columns: [
        { header: 'Umumiy', accessorKey: 'q_total' },
        { header: 'Amal bajarilmaganlar', accessorKey: 'q_not_completed' },
        { header: 'Jarayonda', accessorKey: 'q_in_process' },
        { header: 'Yakunlandi', accessorKey: 'q_completed' },
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Hududiy boshqarma tomonidan reyestrga kiritish bo‘yicha hisobot" />
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-auto">
            <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
          </div>
          <Button className="h-10 w-full sm:w-auto">
            <Download size={18} className="mr-2" /> Excel
          </Button>
        </div>
      </div>

      <div className="mt-0 flex flex-1 flex-col overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          showNumeration={false}
          headerCenter={true}
          data={tableData}
          columns={columns as unknown as any}
          isLoading={false}
        />
      </div>
    </div>
  )
}

export default Report11
