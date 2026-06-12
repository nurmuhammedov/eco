import React, { useMemo, useState, useEffect } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { Report5Item } from './types'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useRegionSelectQuery } from '@/entities/admin/districts'
import { useChildEquipmentTypes } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'

const toCamelCase = (str: string) => {
  if (!str) return ''
  if (!str.includes('_')) return str.toLowerCase().replace('way', 'Way')
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const getId = (s: any) => s?.id ?? s?.value
const getName = (s: any) => s?.name ?? s?.label

const fetchCount = async (filters: any) => {
  try {
    const { data } = await apiClient.get('/equipments', { size: 1, page: 1, ...filters })
    return (data as any)?.page?.totalElements ?? (data as any)?.data?.page?.totalElements ?? 0
  } catch {
    return 0
  }
}

const ALL_EQUIPMENTS = APPLICATIONS_DATA.filter(
  (i) => i?.category === ApplicationCategory.EQUIPMENTS && i?.parentId === MainApplicationCategory.REGISTER
)

const Report5: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const regionNameParam = paramsObject.regionName || 'ALL'
  const equipmentTypeParam = paramsObject.equipmentType || 'ALL'
  const subTypeParam = paramsObject.subType || 'ALL'

  const { data: regionsList } = useRegionSelectQuery()
  const regionOptions = useMemo(() => regionsList || [], [regionsList])

  const { data: subTypesList } = useChildEquipmentTypes(equipmentTypeParam !== 'ALL' ? equipmentTypeParam : '')

  const { regionName: _rn, ...apiParams } = paramsObject
  const { data: reportData, isLoading: isReportDataLoading } = useData<Report5Item[]>(
    '/reports/registry/equipment/status',
    true,
    {
      ...apiParams,
    }
  )

  const [dynamicTableData, setDynamicTableData] = useState<any[]>([])
  const [isDynamicLoading, setIsDynamicLoading] = useState(false)

  const useDynamicData = equipmentTypeParam !== 'ALL'

  // Build Dynamic Table Data
  useEffect(() => {
    if (!useDynamicData) return

    let isMounted = true
    setIsDynamicLoading(true)

    const loadDynamicData = async () => {
      let columnsToFetch: any[] = []
      if (subTypeParam !== 'ALL') {
        columnsToFetch = subTypesList?.filter((s: any) => getId(s)?.toString() === subTypeParam?.toString()) || []
      } else {
        columnsToFetch = [{ id: 'ALL_SUBTYPES', name: 'Barchasi' }, ...(subTypesList || [])]
      }

      const filteredRegions = regionOptions.filter(
        (r: any) => r.name !== 'Respublika' && r.name !== 'Respublika bo‘yicha' && r.name !== "Respublika bo'yicha"
      )

      let rows = [{ id: 'ALL', name: 'Respublika bo‘yicha' }, ...filteredRegions]
      if (regionNameParam !== 'ALL') {
        const summaryRow = rows[0]

        if (regionNameParam === summaryRow.name) {
          rows = [summaryRow]
        } else {
          const found = rows.find((r) => r.name === regionNameParam && r.id !== 'ALL')
          if (found) {
            rows = [summaryRow, found]
          } else {
            rows = [summaryRow]
          }
        }
      }

      let loadedResults: any[] = []
      setDynamicTableData([]) // Clear previous data

      for (const regionRow of rows) {
        if (!isMounted) break

        const regionId = regionRow.id === 'ALL' ? '' : regionRow.id
        const rowData: any = {
          regionName: regionRow.name,
          isSummary: regionRow.id === 'ALL',
        }

        await Promise.all(
          columnsToFetch.map(async (col) => {
            const colId = getId(col)
            const baseKey = `col_${colId}`

            const apiParams =
              colId === 'ALL_SUBTYPES'
                ? { type: equipmentTypeParam, regionId }
                : { type: equipmentTypeParam, childEquipmentId: colId, regionId }

            const [allCount, expiredCount, noDateCount, inactiveCount] = await Promise.all([
              fetchCount({ ...apiParams, active: true }),
              fetchCount({ ...apiParams, active: true, status: 'EXPIRED' }),
              fetchCount({ ...apiParams, active: true, status: 'NO_DATE' }),
              fetchCount({ ...apiParams, active: false }),
            ])

            rowData[`${baseKey}All`] = allCount
            rowData[`${baseKey}Expired`] = expiredCount
            rowData[`${baseKey}NoDate`] = noDateCount
            rowData[`${baseKey}Inactive`] = inactiveCount
            rowData[`${baseKey}Valid`] = allCount - (expiredCount + noDateCount)
          })
        )

        loadedResults = [...loadedResults, rowData]
        if (isMounted) {
          setDynamicTableData(loadedResults)
        }
      }

      if (isMounted) {
        setIsDynamicLoading(false)
      }
    }

    if (subTypesList) {
      loadDynamicData()
    }

    return () => {
      isMounted = false
    }
  }, [useDynamicData, equipmentTypeParam, subTypeParam, subTypesList, regionOptions, regionNameParam])

  // Process standard data
  const standardTableData = useMemo(() => {
    if (useDynamicData) return []
    if (!reportData) return []

    const summaryRow: any = {
      regionName: 'Respublika bo‘yicha',
      isSummary: true,
      allEquipmentsTotalAll: 0,
      allEquipmentsTotalValid: 0,
      allEquipmentsTotalInactive: 0,
      allEquipmentsTotalExpired: 0,
      allEquipmentsTotalNoDate: 0,
    }

    ALL_EQUIPMENTS.forEach((i) => {
      let baseKey = toCamelCase(String(i.equipmentType || ''))
      if (baseKey === 'cableway') baseKey = 'cableWay'

      summaryRow[`${baseKey}All`] = 0
      summaryRow[`${baseKey}Valid`] = 0
      summaryRow[`${baseKey}Inactive`] = 0
      summaryRow[`${baseKey}Expired`] = 0
      summaryRow[`${baseKey}NoDate`] = 0
    })

    const flattenedData = reportData.map((region) => {
      const row: any = {
        regionName: region.regionName,
        allEquipmentsTotalAll: 0,
        allEquipmentsTotalValid: 0,
        allEquipmentsTotalInactive: 0,
        allEquipmentsTotalExpired: 0,
        allEquipmentsTotalNoDate: 0,
      }

      region.types.forEach((typeItem) => {
        if (typeItem.type === 'ELEVATOR') return

        let baseKey = toCamelCase(typeItem.type)
        if (baseKey === 'cableway') baseKey = 'cableWay'

        row[`${baseKey}All`] = typeItem.activeCount
        row[`${baseKey}Valid`] = typeItem.validCount
        row[`${baseKey}Inactive`] = typeItem.inactiveCount
        row[`${baseKey}Expired`] = typeItem.expiredCount
        row[`${baseKey}NoDate`] = typeItem.noDateCount

        row.allEquipmentsTotalAll += typeItem.activeCount || 0
        row.allEquipmentsTotalValid += typeItem.validCount || 0
        row.allEquipmentsTotalInactive += typeItem.inactiveCount || 0
        row.allEquipmentsTotalExpired += typeItem.expiredCount || 0
        row.allEquipmentsTotalNoDate += typeItem.noDateCount || 0

        if (summaryRow[`${baseKey}All`] !== undefined) summaryRow[`${baseKey}All`] += typeItem.activeCount
        if (summaryRow[`${baseKey}Valid`] !== undefined) summaryRow[`${baseKey}Valid`] += typeItem.validCount
        if (summaryRow[`${baseKey}Inactive`] !== undefined) summaryRow[`${baseKey}Inactive`] += typeItem.inactiveCount
        if (summaryRow[`${baseKey}Expired`] !== undefined) summaryRow[`${baseKey}Expired`] += typeItem.expiredCount
        if (summaryRow[`${baseKey}NoDate`] !== undefined) summaryRow[`${baseKey}NoDate`] += typeItem.noDateCount

        summaryRow.allEquipmentsTotalAll += typeItem.activeCount || 0
        summaryRow.allEquipmentsTotalValid += typeItem.validCount || 0
        summaryRow.allEquipmentsTotalInactive += typeItem.inactiveCount || 0
        summaryRow.allEquipmentsTotalExpired += typeItem.expiredCount || 0
        summaryRow.allEquipmentsTotalNoDate += typeItem.noDateCount || 0
      })
      return row
    })

    const filteredData = flattenedData.filter(
      (r) =>
        r.regionName !== 'Respublika' &&
        r.regionName !== 'Respublika bo‘yicha' &&
        r.regionName !== "Respublika bo'yicha"
    )

    const finalData = [summaryRow, ...filteredData]
    if (regionNameParam !== 'ALL') {
      return finalData.filter((r) => r.regionName === regionNameParam || r.isSummary)
    }
    return finalData
  }, [reportData, useDynamicData, regionNameParam])

  const tableData = useDynamicData ? dynamicTableData : standardTableData
  const isLoading = useDynamicData ? isDynamicLoading : isReportDataLoading

  const standardColumns = useMemo(
    () => [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 200,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
        cell: ({ row }: any) => {
          const value = row.original.regionName
          return <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{value}</span>
        },
      },
      {
        header: 'Barcha qurilmalar',
        id: 'col_group_AllEquipmentsTotal',
        columns: [
          {
            header: 'Reyestrda',
            accessorKey: 'allEquipmentsTotalAll',
            className: 'text-center',
            cell: ({ row }: any) => (
              <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.allEquipmentsTotalAll}</span>
            ),
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Muddati <br /> amalda
              </div>
            ),
            accessorKey: 'allEquipmentsTotalValid',
            className: 'text-center',
            cell: ({ row }: any) => (
              <span
                className={cn('text-green-500', row.original.isSummary ? 'font-bold decoration-emerald-500/30' : '')}
              >
                {row.original.allEquipmentsTotalValid}
              </span>
            ),
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Ko‘rik va ishlatish <br /> muddati o‘tgan
              </div>
            ),
            accessorKey: 'allEquipmentsTotalExpired',
            className: 'text-center',
            cell: ({ row }: any) => (
              <span className={row.original.isSummary ? 'font-bold' : ''}>
                {row.original.allEquipmentsTotalExpired}
              </span>
            ),
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Muddati <br /> kiritilmaganlar
              </div>
            ),
            accessorKey: 'allEquipmentsTotalNoDate',
            className: 'text-center',
            cell: ({ row }: any) => (
              <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.allEquipmentsTotalNoDate}</span>
            ),
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Reyestrdan <br /> chiqarilgan
              </div>
            ),
            accessorKey: 'allEquipmentsTotalInactive',
            className: 'text-center',
            cell: ({ row }: any) => (
              <span className={cn('text-red-500', row.original.isSummary ? 'font-bold' : '')}>
                {row.original.allEquipmentsTotalInactive}
              </span>
            ),
          },
        ],
      },
      ...ALL_EQUIPMENTS.map((i) => {
        let baseKey = toCamelCase(String(i.equipmentType || ''))
        if (baseKey === 'cableway') baseKey = 'cableWay'

        const allKey = `${baseKey}All`
        const validKey = `${baseKey}Valid`
        const inactiveKey = `${baseKey}Inactive`
        const expiredKey = `${baseKey}Expired`
        const noDateKey = `${baseKey}NoDate`

        return {
          header: i?.name || '',
          columns: [
            {
              header: 'Reyestrda',
              accessorKey: allKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[allKey]}</span>
              ),
            },
            {
              header: () => (
                <div className="text-center whitespace-nowrap">
                  Muddati <br /> amalda
                </div>
              ),
              accessorKey: validKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span
                  className={cn('text-green-500', row.original.isSummary ? 'font-bold decoration-emerald-500/30' : '')}
                >
                  {row.original[validKey]}
                </span>
              ),
            },
            {
              header: () => (
                <div className="text-center whitespace-nowrap">
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
              header: () => (
                <div className="text-center whitespace-nowrap">
                  Muddati <br /> kiritilmaganlar
                </div>
              ),
              accessorKey: noDateKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[noDateKey]}</span>
              ),
            },
            {
              header: () => (
                <div className="text-center whitespace-nowrap">
                  Reyestrdan <br /> chiqarilgan
                </div>
              ),
              accessorKey: inactiveKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={cn('text-red-500', row.original.isSummary ? 'font-bold' : '')}>
                  {row.original[inactiveKey]}
                </span>
              ),
            },
          ],
        }
      }),
    ],
    []
  )

  const dynamicColumns = useMemo(() => {
    let subTypesToRender: any[] = []
    if (subTypeParam !== 'ALL') {
      subTypesToRender = subTypesList?.filter((s: any) => getId(s)?.toString() === subTypeParam?.toString()) || []
    } else {
      subTypesToRender = [{ id: 'ALL_SUBTYPES', name: 'Barchasi' }, ...(subTypesList || [])]
    }

    return [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 200,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
        cell: ({ row }: any) => {
          const value = row.original.regionName
          return <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{value}</span>
        },
      },
      ...subTypesToRender.map((i: any) => {
        const colId = getId(i)
        const baseKey = `col_${colId}`

        const allKey = `${baseKey}All`
        const validKey = `${baseKey}Valid`
        const inactiveKey = `${baseKey}Inactive`
        const expiredKey = `${baseKey}Expired`
        const noDateKey = `${baseKey}NoDate`

        return {
          id: `col_group_${colId}`,
          header: getName(i) || '',
          columns: [
            {
              header: 'Reyestrda',
              accessorKey: allKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[allKey]}</span>
              ),
            },
            {
              header: () => (
                <div className="text-center whitespace-nowrap">
                  Muddati <br /> amalda
                </div>
              ),
              accessorKey: validKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span
                  className={cn('text-green-500', row.original.isSummary ? 'font-bold decoration-emerald-500/30' : '')}
                >
                  {row.original[validKey]}
                </span>
              ),
            },
            {
              header: () => (
                <div className="text-center whitespace-nowrap">
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
              header: () => (
                <div className="text-center whitespace-nowrap">
                  Muddati <br /> kiritilmaganlar
                </div>
              ),
              accessorKey: noDateKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[noDateKey]}</span>
              ),
            },
            {
              header: () => (
                <div className="text-center whitespace-nowrap">
                  Reyestrdan <br /> chiqarilgan
                </div>
              ),
              accessorKey: inactiveKey,
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={cn('text-red-500', row.original.isSummary ? 'font-bold' : '')}>
                  {row.original[inactiveKey]}
                </span>
              ),
            },
          ],
        }
      }),
    ]
  }, [subTypeParam, subTypesList])

  const columns = useDynamicData ? dynamicColumns : standardColumns

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-4 p-0.5 xl:flex-row xl:items-center">
        <GoBack title="Qurilmalarning muddatlari bo‘yicha hisobot" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={regionNameParam} onValueChange={(val) => addParams({ regionName: val })}>
            <SelectTrigger className="h-10 w-[220px] bg-white">
              <SelectValue placeholder="Hudud" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              <SelectItem value="Respublika bo‘yicha">Respublika bo‘yicha</SelectItem>
              {regionOptions.map((region: any) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={equipmentTypeParam?.toString()}
            onValueChange={(val) => addParams({ equipmentType: val, subType: 'ALL' })}
          >
            <SelectTrigger className="h-10 w-[220px] bg-white">
              <SelectValue placeholder="Qurilma turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              {ALL_EQUIPMENTS.map((eq) => (
                <SelectItem key={eq.equipmentType as string} value={eq.equipmentType as string}>
                  {eq.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subTypeParam?.toString()} onValueChange={(val) => addParams({ subType: val })}>
            <SelectTrigger className="h-10 w-[220px] bg-white">
              <SelectValue placeholder="Qurilmaning quyi turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              {subTypesList?.map((subType: any) => (
                <SelectItem key={getId(subType)?.toString()} value={getId(subType)?.toString()}>
                  {getName(subType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
