import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

const Report10: React.FC = () => {
  const tableData = React.useMemo(() => {
    return [
      {
        isSummary: true,
        officeName: 'Respublika bo‘yicha',
        y_5: 81,
        y_10: 8,
        y_15: 1,
        y_30: 2,
        y_more: 1,
        y_total: 93,
        j_5: 93,
        j_10: 32,
        j_15: 101,
        j_30: 62,
        j_more: 246,
        j_total: 534,
        k_5: 25,
        k_10: 6,
        k_15: 3,
        k_30: 4,
        k_more: 0,
        k_total: 38,
        t_5: 14,
        t_10: 0,
        t_15: 0,
        t_30: 0,
        t_more: 0,
        t_total: 14,
        u_5: 213,
        u_10: 46,
        u_15: 105,
        u_30: 68,
        u_more: 247,
        u_total: 679,
      },
      {
        officeName: 'Toshkent shahri',
        y_5: 0,
        y_10: 0,
        y_15: 0,
        y_30: 0,
        y_more: 0,
        y_total: 0,
        j_5: 4,
        j_10: 0,
        j_15: 0,
        j_30: 3,
        j_more: 0,
        j_total: 7,
        k_5: 0,
        k_10: 0,
        k_15: 0,
        k_30: 0,
        k_more: 0,
        k_total: 0,
        t_5: 0,
        t_10: 0,
        t_15: 0,
        t_30: 0,
        t_more: 0,
        t_total: 0,
        u_5: 4,
        u_10: 0,
        u_15: 0,
        u_30: 3,
        u_more: 0,
        u_total: 7,
      },
      // More regions can be added here with similar structure
    ]
  }, [])

  const createGroup = (prefix: string, header: string) => ({
    header,
    columns: [
      {
        header: '5 kungacha',
        accessorKey: `${prefix}_5`,
        cell: ({ row }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[`${prefix}_5`] ?? 0}</span>
        ),
      },
      {
        header: '5-10 kun',
        accessorKey: `${prefix}_10`,
        cell: ({ row }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[`${prefix}_10`] ?? 0}</span>
        ),
      },
      {
        header: '10-15 kun',
        accessorKey: `${prefix}_15`,
        cell: ({ row }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[`${prefix}_15`] ?? 0}</span>
        ),
      },
      {
        header: '15-30 kun',
        accessorKey: `${prefix}_30`,
        cell: ({ row }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[`${prefix}_30`] ?? 0}</span>
        ),
      },
      {
        header: '30 kundan ortiq',
        accessorKey: `${prefix}_more`,
        cell: ({ row }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[`${prefix}_more`] ?? 0}</span>
        ),
      },
      {
        header: 'Jami',
        accessorKey: `${prefix}_total`,
        cell: ({ row }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[`${prefix}_total`] ?? 0}</span>
        ),
      },
    ],
  })

  const columns: ColumnDef<any>[] = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.officeName}</span>
      ),
    },
    createGroup('y', 'Yangi'),
    createGroup('j', 'Jarayonda'),
    createGroup('k', 'Kelishishda'),
    createGroup('t', 'Tasdiqlashda'),
    createGroup('u', 'Umumiy'),
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Arizalarning ijro muddati bo‘yicha umumiy hisobot" />
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

export default Report10
