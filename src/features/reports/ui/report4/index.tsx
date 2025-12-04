import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
import { apiClient } from '@/shared/api'
import { format } from 'date-fns'
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'

const Report1: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: inspections, isLoading } = useData<any[]>('/reports/appeal-status', true, {
    ...paramsObject,
    ownerType: 'LEGAL',
  })

  const tableData = useMemo(() => {
    if (!inspections) return []
    const summaryRow = {
      officeName: 'Respublika bo‘yicha',
      isSummary: true,
      count: 0,
    }
    return [summaryRow, ...inspections]
  }, [inspections])

  const DoubleValueCell = () => (
    <div className="grid w-full grid-cols-2 items-center">
      <div className="border-r border-gray-300 pr-2 text-center">0</div>
      <div className="pl-2 text-center">0</div>
    </div>
  )

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'T/r',
        cell: ({ row }) => (row.original.isSummary ? <span></span> : row.index + 1),
        size: 50,
      },
      {
        header: 'Hududiy boshqarma/bo‘limlar',
        accessorKey: 'officeName',
        minSize: 250,
        cell: ({ row }) => (
          <span className={row.original.isSummary ? 'text-base font-bold' : ''}>{row.original.officeName}</span>
        ),
      },
      {
        header: 'XICHO',
        cell: () => <DoubleValueCell />,
        minSize: 150,
      },
      ...(APPLICATIONS_DATA.filter(
        (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER
      )
        .map((i) => ({
          id: i?.equipmentType ?? '',
          name: i?.name ?? '',
        }))
        .map((i) => ({
          header: i?.name || '',
          cell: () => <DoubleValueCell />,
          minSize: 150,
        })) ?? []),
      {
        header: 'INM',
        cell: () => <DoubleValueCell />,
        minSize: 150,
      },
      {
        header: 'Rentgenlar',
        cell: () => <DoubleValueCell />,
        minSize: 150,
      },
    ],
    []
  )

  const handleDownloadExel = async () => {
    const res = await apiClient.downloadFile<Blob>('/reports/appeal-status/export-excel', {
      ...paramsObject,
      ownerType: 'LEGAL',
    })

    const blob = res.data
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date()
    const filename = `Hisobot (${format(today, 'dd.MM.yyyy')}).xlsx`
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <GoBack title="Davlat ro‘yxatidan o‘tqazilgan amaldagi XICHO, INM, Bosim ostidagi idishlar va qurilmalar to‘g‘risida sanalar bo‘yicha maʼlumot" />
      </div>

      <div className="my-2 flex items-start justify-between gap-2">
        <div className="flex flex-1 justify-start">
          <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
        </div>
        <Button disabled={true} onClick={handleDownloadExel}>
          <Download /> MS Exel
        </Button>
      </div>

      <DataTable
        showNumeration={false}
        headerCenter={true}
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        className="h-[calc(100vh-240px)]"
      />
    </div>
  )
}

export default Report1
