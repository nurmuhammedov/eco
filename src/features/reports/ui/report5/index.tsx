import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { Report5Item } from './types'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'

const toCamelCase = (str: string) => {
  if (!str) return ''
  if (!str.includes('_')) return str.toLowerCase().replace('way', 'Way')
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const Report5: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: reportData, isLoading } = useData<Report5Item[]>('/reports/registry/equipment/status', true, {
    ...paramsObject,
  })

  useData(`/reports/user-login?size=1000`)

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

    const filteredData = flattenedData.filter((r) => !r.regionName?.toLowerCase().includes('respublika'))

    return [summaryRow, ...filteredData]
  }, [reportData])

  const columns: any[] = useMemo(
    () => [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 200,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
        cell: ({ row }: any) => {
          const value = row.original.regionName
          const isRespublika = value?.toLowerCase().includes('respublika')
          return (
            <span className={cn(row.original.isSummary || isRespublika ? 'font-bold' : '')}>
              {isRespublika ? 'Respublika bo‘yicha' : value}
            </span>
          )
        },
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
          if (baseKey === 'cableway') baseKey = 'cableWay'

          const validKey = `${baseKey}Valid`
          const inactiveKey = `${baseKey}Inactive`
          const expiredKey = `${baseKey}Expired`
          const noDateKey = `${baseKey}NoDate`

          return {
            header: i?.name || '',
            columns: [
              {
                header: 'Reyestrda amalda',
                accessorKey: validKey,
                className: 'text-center',
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold decoration-emerald-500/30' : ''}>
                    {row.original[validKey]}
                  </span>
                ),
              },
              {
                header: 'Reyestrdan chiqarilgan',
                accessorKey: inactiveKey,
                className: 'text-center',
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[inactiveKey]}</span>
                ),
              },
              {
                header: () => (
                  <div className="text-center">
                    Ko‘rik va ishlatish <br /> muddati o‘tgan
                  </div>
                ),
                accessorKey: expiredKey,
                className: 'text-center',
                cell: ({ row }: any) => (
                  <span className={row.original.isSummary ? 'font-bold decoration-red-500/30' : ''}>
                    {row.original[expiredKey]}
                  </span>
                ),
              },
              {
                header: 'Muddati kiritilmaganlar',
                accessorKey: noDateKey,
                className: 'text-center',
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

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Qurilmalarning muddatlari bo‘yicha hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          showNumeration={false}
          headerCenter={true}
          data={tableData}
          columns={columns}
          isLoading={isLoading}
          isHeaderSticky={true}
          initialState={{
            columnPinning: {
              left: ['regionName'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Report5
