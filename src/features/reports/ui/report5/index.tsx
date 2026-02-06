import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
import { apiClient } from '@/shared/api/api-client'
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { Report5Item } from './types'
import { useSearchParams } from 'react-router-dom'

const toCamelCase = (str: string) => {
  if (!str) return ''
  if (!str.includes('_')) return str.toLowerCase().replace('way', 'Way')
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const Report5: React.FC = () => {
  const [searchParams] = useSearchParams()
  const paramsObject = Object.fromEntries(searchParams.entries())

  const { data: reportData, isLoading } = useData<Report5Item[]>('/reports/registry/equipment/status', true, {
    ...paramsObject,
  })

  const tableData = useMemo(() => {
    if (!reportData) return []

    const summaryRow: any = {
      regionName: 'Respublika bo‘yicha',
      isSummary: true,
    }

    const dynamicItems = APPLICATIONS_DATA.filter(
      (i) => i?.category === ApplicationCategory.EQUIPMENTS && i?.parentId === MainApplicationCategory.REGISTER
    )

    dynamicItems.forEach((i) => {
      let baseKey = toCamelCase(String(i.equipmentType || ''))
      if (baseKey === 'cableway') baseKey = 'cableWay'

      summaryRow[`${baseKey}Valid`] = 0
      summaryRow[`${baseKey}Inactive`] = 0
      summaryRow[`${baseKey}Expired`] = 0
      summaryRow[`${baseKey}NoDate`] = 0
    })

    const flattenedData = reportData.map((region) => {
      const row: any = { regionName: region.regionName }

      region.types.forEach((typeItem) => {
        let baseKey = toCamelCase(typeItem.type)
        if (baseKey === 'cableway') baseKey = 'cableWay'

        row[`${baseKey}Valid`] = typeItem.validCount
        row[`${baseKey}Inactive`] = typeItem.inactiveCount
        row[`${baseKey}Expired`] = typeItem.expiredCount
        row[`${baseKey}NoDate`] = typeItem.noDateCount

        if (summaryRow[`${baseKey}Valid`] !== undefined) summaryRow[`${baseKey}Valid`] += typeItem.validCount
        if (summaryRow[`${baseKey}Inactive`] !== undefined) summaryRow[`${baseKey}Inactive`] += typeItem.inactiveCount
        if (summaryRow[`${baseKey}Expired`] !== undefined) summaryRow[`${baseKey}Expired`] += typeItem.expiredCount
        if (summaryRow[`${baseKey}NoDate`] !== undefined) summaryRow[`${baseKey}NoDate`] += typeItem.noDateCount
      })
      return row
    })

    return [summaryRow, ...flattenedData]
  }, [reportData])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        cell: ({ row }) => (
          <span className={row.original.isSummary ? 'text-base font-bold' : ''}>{row.original.regionName}</span>
        ),
      },
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

          const validKey = `${baseKey}Valid`
          const inactiveKey = `${baseKey}Inactive`
          const expiredKey = `${baseKey}Expired`
          const noDateKey = `${baseKey}NoDate`

          return {
            header: i?.name || '',
            columns: [
              {
                header: 'Reyestrdagi qurilmalar',
                accessorKey: validKey,
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[validKey]}</span>
                ),
              },
              {
                header: 'Reyestrdan chiqarilgan',
                accessorKey: inactiveKey,
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[inactiveKey]}</span>
                ),
              },
              {
                header: 'Muddati o‘tgan',
                accessorKey: expiredKey,
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[expiredKey]}</span>
                ),
              },
              {
                header: 'Muddati kiritilmagan',
                accessorKey: noDateKey,
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[noDateKey]}</span>
                ),
              },
            ],
          }
        }),
    ],
    []
  )

  const handleDownloadExcel = async () => {
    try {
      const res = await apiClient.downloadFile<Blob>('/reports/registry/equipment/status/export-excel', {
        ...paramsObject,
      })

      const blob = res.data
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const filename = `Hisobot.xlsx`
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Download failed', e)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <GoBack title="Qurilmalaring muddatlari bo‘yicha hisobot" />
      </div>

      <div className="my-2 flex items-start justify-between gap-2">
        <div className="flex flex-1 justify-start"></div>
        <Button onClick={handleDownloadExcel} disabled={true}>
          <Download className="mr-2 h-4 w-4" /> Excel
        </Button>
      </div>

      <DataTable showNumeration={false} headerCenter={true} data={tableData} columns={columns} isLoading={isLoading} />
    </div>
  )
}

export default Report5
