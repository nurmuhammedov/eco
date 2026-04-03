import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

const Report8: React.FC = () => {
  const tableData = React.useMemo(() => {
    return [
      {
        isSummary: true,
        officeName: 'Respublika bo‘yicha',
        x_total: 426,
        x_entrepreneur: 153,
        x_inspector: 273,
        x_not_completed: 64,
        x_in_process: 145,
        x_completed: 217,
        q_total: 1204,
        q_entrepreneur: 445,
        q_inspector: 759,
        q_not_completed: 249,
        q_in_process: 396,
        q_completed: 559,
      },
      {
        officeName: 'Toshkent shahri',
        x_total: 41,
        x_entrepreneur: 17,
        x_inspector: 24,
        x_not_completed: 3,
        x_in_process: 36,
        x_completed: 2,
        q_total: 170,
        q_entrepreneur: 164,
        q_inspector: 6,
        q_not_completed: 1,
        q_in_process: 123,
        q_completed: 46,
      },
      {
        officeName: 'Samarqand viloyati',
        x_total: 8,
        x_entrepreneur: 4,
        x_inspector: 4,
        x_not_completed: 0,
        x_in_process: 3,
        x_completed: 5,
        q_total: 25,
        q_entrepreneur: 0,
        q_inspector: 25,
        q_not_completed: 0,
        q_in_process: 8,
        q_completed: 17,
      },
      {
        officeName: 'Navoiy viloyati',
        x_total: 104,
        x_entrepreneur: 74,
        x_inspector: 30,
        x_not_completed: 27,
        x_in_process: 58,
        x_completed: 19,
        q_total: 564,
        q_entrepreneur: 251,
        q_inspector: 313,
        q_not_completed: 239,
        q_in_process: 239,
        q_completed: 86,
      },
      {
        officeName: 'Toshkent viloyati',
        x_total: 26,
        x_entrepreneur: 1,
        x_inspector: 25,
        x_not_completed: 1,
        x_in_process: 22,
        x_completed: 3,
        q_total: 18,
        q_entrepreneur: 2,
        q_inspector: 16,
        q_not_completed: 0,
        q_in_process: 6,
        q_completed: 12,
      },
      {
        officeName: 'Andijon viloyati',
        x_total: 2,
        x_entrepreneur: 0,
        x_inspector: 2,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 2,
        q_total: 4,
        q_entrepreneur: 0,
        q_inspector: 4,
        q_not_completed: 0,
        q_in_process: 4,
        q_completed: 0,
      },
      {
        officeName: 'Namangan viloyati',
        x_total: 40,
        x_entrepreneur: 40,
        x_inspector: 0,
        x_not_completed: 32,
        x_in_process: 2,
        x_completed: 6,
        q_total: 9,
        q_entrepreneur: 7,
        q_inspector: 2,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 9,
      },
      {
        officeName: 'Xorazm viloyati',
        x_total: 91,
        x_entrepreneur: 1,
        x_inspector: 90,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 91,
        q_total: 246,
        q_entrepreneur: 0,
        q_inspector: 246,
        q_not_completed: 0,
        q_in_process: 1,
        q_completed: 245,
      },
      {
        officeName: 'Buxoro viloyati',
        x_total: 15,
        x_entrepreneur: 0,
        x_inspector: 15,
        x_not_completed: 0,
        x_in_process: 7,
        x_completed: 8,
        q_total: 19,
        q_entrepreneur: 3,
        q_inspector: 16,
        q_not_completed: 2,
        q_in_process: 2,
        q_completed: 15,
      },
      {
        officeName: 'Farg‘ona viloyati',
        x_total: 30,
        x_entrepreneur: 7,
        x_inspector: 23,
        x_not_completed: 0,
        x_in_process: 8,
        x_completed: 22,
        q_total: 3,
        q_entrepreneur: 0,
        q_inspector: 3,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 3,
      },
      {
        officeName: 'Jizzax viloyati',
        x_total: 7,
        x_entrepreneur: 0,
        x_inspector: 7,
        x_not_completed: 0,
        x_in_process: 5,
        x_completed: 2,
        q_total: 6,
        q_entrepreneur: 0,
        q_inspector: 6,
        q_not_completed: 0,
        q_in_process: 6,
        q_completed: 0,
      },
      {
        officeName: 'Qashqadaryo viloyati',
        x_total: 5,
        x_entrepreneur: 4,
        x_inspector: 1,
        x_not_completed: 1,
        x_in_process: 0,
        x_completed: 4,
        q_total: 102,
        q_entrepreneur: 10,
        q_inspector: 92,
        q_not_completed: 6,
        q_in_process: 4,
        q_completed: 92,
      },
      {
        officeName: 'Qoraqalpog‘iston Respublikasi',
        x_total: 27,
        x_entrepreneur: 2,
        x_inspector: 25,
        x_not_completed: 0,
        x_in_process: 0,
        x_completed: 27,
        q_total: 32,
        q_entrepreneur: 7,
        q_inspector: 25,
        q_not_completed: 0,
        q_in_process: 2,
        q_completed: 30,
      },
      {
        officeName: 'Sirdaryo viloyati',
        x_total: 17,
        x_entrepreneur: 1,
        x_inspector: 16,
        x_not_completed: 0,
        x_in_process: 1,
        x_completed: 16,
        q_total: 4,
        q_entrepreneur: 0,
        q_inspector: 4,
        q_not_completed: 0,
        q_in_process: 0,
        q_completed: 4,
      },
      {
        officeName: 'Surxondaryo viloyati',
        x_total: 13,
        x_entrepreneur: 2,
        x_inspector: 11,
        x_not_completed: 0,
        x_in_process: 3,
        x_completed: 10,
        q_total: 2,
        q_entrepreneur: 1,
        q_inspector: 1,
        q_not_completed: 1,
        q_in_process: 1,
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
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_total}</span>
          ),
        },
        {
          header: 'Tadbirkor tomonidan so‘rovlar',
          accessorKey: 'x_entrepreneur',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_entrepreneur}</span>
          ),
        },
        {
          header: 'Inspektor tomonidan so‘rovlar',
          accessorKey: 'x_inspector',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_inspector}</span>
          ),
        },
        {
          header: 'Amal bajarilmaganlar',
          accessorKey: 'x_not_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_not_completed}</span>
          ),
        },
        {
          header: 'Jarayonda',
          accessorKey: 'x_in_process',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_in_process}</span>
          ),
        },
        {
          header: 'Yakunlandi',
          accessorKey: 'x_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.x_completed}</span>
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
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_total}</span>
          ),
        },
        {
          header: 'Tadbirkor tomonidan so‘rovlar',
          accessorKey: 'q_entrepreneur',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_entrepreneur}</span>
          ),
        },
        {
          header: 'Inspektor tomonidan so‘rovlar',
          accessorKey: 'q_inspector',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_inspector}</span>
          ),
        },
        {
          header: 'Amal bajarilmaganlar',
          accessorKey: 'q_not_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_not_completed}</span>
          ),
        },
        {
          header: 'Jarayonda',
          accessorKey: 'q_in_process',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_in_process}</span>
          ),
        },
        {
          header: 'Yakunlandi',
          accessorKey: 'q_completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.q_completed}</span>
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="O‘zgarishlar bo‘yicha hisobot" />
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

export default Report8
