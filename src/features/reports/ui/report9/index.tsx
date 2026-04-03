import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

const Report9: React.FC = () => {
  const tableData = React.useMemo(() => {
    return [
      {
        isSummary: true,
        officeName: 'Respublika bo‘yicha',
        x_total: 8,
        x_not_completed: 0,
        x_in_process: 6,
        x_completed: 2,
        q_total: 6,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 6,
      },
      {
        officeName: 'Toshkent shahri',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Samarqand viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Navoiy viloyati',
        x_total: 1,
        x_not_completed: 0,
        x_in_process: 1,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Toshkent viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 5,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 5,
      },
      {
        officeName: 'Andijon viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Namangan viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Xorazm viloyati',
        x_total: 2,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 2,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Buxoro viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Farg‘ona viloyati',
        x_total: 5,
        x_not_completed: 0,
        x_in_process: 5,
        x_completed: 0,
        q_total: 1,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 1,
      },
      {
        officeName: 'Jizzax viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Qashqadaryo viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Qoraqalpog‘iston Respublikasi',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Sirdaryo viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
      {
        officeName: 'Surxondaryo viloyati',
        x_total: 0,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 0,
        q_total: 0,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 0,
      },
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
        {
          header: 'Umumiy',
          accessorKey: 'x_total',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_total || ''}</span>
          ),
        },
        {
          header: 'Amal bajarilmaganlar',
          accessorKey: 'x_not_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_not_completed || ''}</span>
          ),
        },
        {
          header: 'Jarayonda',
          accessorKey: 'x_in_process',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_in_process || ''}</span>
          ),
        },
        {
          header: 'Yakunlandi',
          accessorKey: 'x_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_completed || ''}</span>
          ),
        },
      ],
    },
    {
      header: 'Qurilmalar',
      columns: [
        {
          header: 'Umumiy',
          accessorKey: 'q_total',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_total || ''}</span>
          ),
        },
        {
          header: 'Amal bajarilmaganlar',
          accessorKey: 'q_not_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_not_completed || ''}</span>
          ),
        },
        {
          header: 'Jarayonda',
          accessorKey: 'q_in_process',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_in_process || ''}</span>
          ),
        },
        {
          header: 'Yakunlandi',
          accessorKey: 'q_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_completed || ''}</span>
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Hududiy boshqarma tomonidan reyestrdan chiqarish bo‘yicha hisobot" />
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

export default Report9
