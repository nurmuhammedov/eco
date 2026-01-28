import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
import { apiClient } from '@/shared/api/api-client'
import { format } from 'date-fns'
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'

const toCamelCase = (str: string) => {
  if (!str) return ''
  if (!str.includes('_')) return str.toLowerCase().replace('way', 'Way')
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const DoubleValueCell = ({
  present = 0,
  period = 0,
  isSummary = false,
}: {
  present: number
  period: number
  isSummary?: boolean
}) => (
  <div className="grid w-full grid-cols-2 items-center">
    <div className={`border-r border-gray-300 pr-2 text-center ${isSummary ? 'font-bold' : ''}`}>{present}</div>
    <div className={`pl-2 text-center ${isSummary ? 'font-bold' : ''} ${period ? 'text-green-600' : ''}`}>{period}</div>
  </div>
)

const Report1: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: inspections, isLoading } = useData<any[]>('/reports/registry/present-and-period', true, {
    ...paramsObject,
  })

  const tableData = useMemo(() => {
    if (!inspections) return []
    const regions = inspections.filter((i) => i?.regionName !== 'Respublika bo‘yicha' && !!i?.regionName)

    const summaryRow: any = {
      regionName: 'Respublika bo‘yicha',
      isSummary: true,
      hfPresentCount: 0,
      hfPeriodCount: 0,
      irsPresentCount: 0,
      irsPeriodCount: 0,
      xrayPresentCount: 0,
      xrayPeriodCount: 0,
    }

    const dynamicItems = APPLICATIONS_DATA.filter(
      (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER
    )

    dynamicItems.forEach((i) => {
      let baseKey = toCamelCase(String(i.equipmentType || ''))
      if (baseKey === 'cableway') baseKey = 'cableWay'
      summaryRow[`${baseKey}PresentCount`] = 0
      summaryRow[`${baseKey}PeriodCount`] = 0
    })

    regions.forEach((row) => {
      summaryRow.hfPresentCount += row.hfPresentCount || 0
      summaryRow.hfPeriodCount += row.hfPeriodCount || 0
      summaryRow.irsPresentCount += row.irsPresentCount || 0
      summaryRow.irsPeriodCount += row.irsPeriodCount || 0
      summaryRow.xrayPresentCount += row.xrayPresentCount || 0
      summaryRow.xrayPeriodCount += row.xrayPeriodCount || 0

      dynamicItems.forEach((i) => {
        let baseKey = toCamelCase(String(i.equipmentType || ''))
        if (baseKey === 'cableway') baseKey = 'cableWay'

        const presentKey = `${baseKey}PresentCount`
        const periodKey = `${baseKey}PeriodCount`

        summaryRow[presentKey] += row[presentKey] || 0
        summaryRow[periodKey] += row[periodKey] || 0
      })
    })

    return [summaryRow, ...regions]
  }, [inspections])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'T/r',
        cell: ({ row }) => (row.original.isSummary ? <span></span> : row.index),
        size: 50,
      },
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        minSize: 250,
        cell: ({ row }) => (
          <span className={row.original.isSummary ? 'text-base font-bold' : ''}>{row.original.regionName}</span>
        ),
      },
      {
        header: 'XICHO',
        cell: ({ row }: any) => (
          <DoubleValueCell
            present={row.original['hfPresentCount']}
            period={row.original['hfPeriodCount']}
            isSummary={row.original.isSummary}
          />
        ),
        minSize: 150,
      },

      // Dynamic equipment columns
      ...APPLICATIONS_DATA.filter(
        (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER
      )
        .map((i) => ({
          id: i?.equipmentType ?? '',
          name: i?.name ?? '',
        }))
        .map((i) => {
          let baseKey = toCamelCase(String(i.id))

          if (baseKey === 'cableway') {
            baseKey = 'cableWay'
          }

          const presentKey = `${baseKey}PresentCount`
          const periodKey = `${baseKey}PeriodCount`

          return {
            header: i?.name || '',
            cell: ({ row }: any) => (
              <DoubleValueCell
                present={row.original[presentKey]}
                period={row.original[periodKey]}
                isSummary={row.original.isSummary}
              />
            ),
            minSize: 150,
          }
        }),

      {
        header: 'INM',
        accessorKey: 'inm',
        minSize: 150,
        cell: ({ row }) => (
          <DoubleValueCell
            present={row.original['irsPresentCount']}
            period={row.original['irsPeriodCount']}
            isSummary={row.original.isSummary}
          />
        ),
      },
      {
        header: 'Rentgenlar',
        accessorKey: 'xray',
        minSize: 150,
        cell: ({ row }) => (
          <DoubleValueCell
            present={row.original['xrayPresentCount']}
            period={row.original['xrayPeriodCount']}
            isSummary={row.original.isSummary}
          />
        ),
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
