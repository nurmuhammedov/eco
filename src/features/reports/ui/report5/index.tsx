import React, { useMemo } from 'react'
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

const toCamelCase = (str: string) => {
  if (!str) return ''
  if (!str.includes('_')) return str.toLowerCase().replace('way', 'Way')
  return str.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

const getId = (s: any) => s?.id ?? s?.value
const getName = (s: any) => s?.name ?? s?.label

const ALL_EQUIPMENTS = APPLICATIONS_DATA.filter(
  (i) => i?.category === ApplicationCategory.EQUIPMENTS && i?.parentId === MainApplicationCategory.REGISTER
)

const normalizeName = (name: string) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .replace(/\s+/g, '') // remove all spaces
    .replace(/['‘`ʼ]/g, "'") // normalize single quotes
    .replace(/tt/g, 't') // normalize double t for Attraksion/Atraksion
}

const backendNameToEnumMap: Record<string, string> = ALL_EQUIPMENTS.reduce(
  (acc: any, cur: any) => {
    if (cur.name && cur.equipmentType) {
      acc[normalizeName(cur.name)] = cur.equipmentType
    }
    return acc
  },
  {} as Record<string, string>
)

const Report5: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const regionNameParam = paramsObject.regionName || 'ALL'
  const equipmentTypeParam = paramsObject.equipmentType || 'ALL'
  const subTypeParam = paramsObject.subType || 'ALL'

  const { data: regionsList } = useRegionSelectQuery()
  const regionOptions = useMemo(() => regionsList || [], [regionsList])

  const { data: subTypesList } = useChildEquipmentTypes(equipmentTypeParam !== 'ALL' ? equipmentTypeParam : '')
  const { regionName: _rn, equipmentType, subType, ...restParams } = paramsObject
  const apiParams: any = { ...restParams }
  if (equipmentType && equipmentType !== 'ALL') {
    apiParams.equipmentType = equipmentType
  }
  if (subType && subType !== 'ALL') {
    apiParams.childEquipmentId = subType
  }

  const { data: reportData, isLoading: isReportDataLoading } = useData<Report5Item[]>(
    '/reports/registry/equipment/status',
    true,
    apiParams
  )

  const useDynamicData = equipmentTypeParam !== 'ALL'

  // Process dynamic data directly from reportData
  const dynamicTableData = useMemo(() => {
    if (!useDynamicData || !subTypesList || !reportData) return []

    // Prepare columns to know which names to look for
    const columnsToFetch = [{ id: 'ALL_SUBTYPES', name: 'Barcha qurilmalar' }]
    if (subTypeParam === 'ALL') {
      columnsToFetch.push(...subTypesList)
    } else {
      const found = subTypesList.find((s: any) => String(s.id) === String(subTypeParam))
      if (found) columnsToFetch.push(found)
    }

    // Prepare base rows
    const filteredRegions = regionOptions.filter(
      (r: any) => r.name !== 'Respublika' && r.name !== 'Respublika bo‘yicha' && r.name !== "Respublika bo'yicha"
    )

    let rows = [{ id: 'ALL', name: 'Respublika bo‘yicha' }, ...filteredRegions]
    if (regionNameParam !== 'ALL') {
      const summaryRow = rows[0]
      if (regionNameParam === summaryRow.name) {
        rows = [summaryRow]
      } else {
        const found = rows.find((r) => r.name === regionNameParam)
        rows = found ? [summaryRow, found] : [summaryRow]
      }
    }

    return rows.map((regionRow) => {
      const isSummary = regionRow.id === 'ALL'
      const row: any = {
        regionName: regionRow.name,
        isSummary,
      }

      let regionData
      if (isSummary) {
        regionData = reportData.find(
          (r: any) =>
            r.regionName === 'Respublika' ||
            r.regionName === 'Respublika bo‘yicha' ||
            r.regionName === "Respublika bo'yicha"
        )
      } else {
        regionData = reportData.find((r: any) => r.regionName === regionRow.name)
      }

      const itemsArray = regionData?.types || regionData?.items || []

      columnsToFetch.forEach((col) => {
        const colId = getId(col)
        const baseKey = `col_${colId}`

        let activeCount = 0,
          expiredCount = 0,
          noDateCount = 0,
          inactiveCount = 0,
          validCount = 0

        if (colId === 'ALL_SUBTYPES') {
          // Sum all items
          itemsArray.forEach((t: any) => {
            activeCount += t.activeCount || 0
            expiredCount += t.expiredCount || 0
            noDateCount += t.noDateCount || 0
            inactiveCount += t.inactiveCount || 0
            validCount += t.validCount || 0
          })
        } else {
          // Find specific subtype by matching name with subTypesList name
          const matchedItem = itemsArray.find((t: any) => t.name === col.name)
          if (matchedItem) {
            activeCount = matchedItem.activeCount || 0
            expiredCount = matchedItem.expiredCount || 0
            noDateCount = matchedItem.noDateCount || 0
            inactiveCount = matchedItem.inactiveCount || 0
            validCount = matchedItem.validCount || 0
          }
        }

        row[`${baseKey}All`] = activeCount
        row[`${baseKey}Expired`] = expiredCount
        row[`${baseKey}NoDate`] = noDateCount
        row[`${baseKey}Inactive`] = inactiveCount
        row[`${baseKey}Valid`] = validCount
      })

      return row
    })
  }, [useDynamicData, reportData, subTypesList, regionOptions, regionNameParam, subTypeParam])

  const isDynamicLoading = isReportDataLoading

  // Process standard data
  const standardTableData = useMemo(() => {
    if (useDynamicData) return []
    if (!reportData) return []

    const flattenedData = reportData.map((region) => {
      const row: any = {
        regionName: region.regionName,
        isSummary:
          region.regionName === 'Respublika' ||
          region.regionName === 'Respublika bo‘yicha' ||
          region.regionName === "Respublika bo'yicha",
        allEquipmentsTotalAll: 0,
        allEquipmentsTotalValid: 0,
        allEquipmentsTotalInactive: 0,
        allEquipmentsTotalExpired: 0,
        allEquipmentsTotalNoDate: 0,
      }

      const typesArray: any[] = region.types || region.items || []
      typesArray.forEach((typeItem) => {
        const typeName = typeItem.type || backendNameToEnumMap[typeItem.name] || typeItem.name
        if (typeName === 'ELEVATOR' || typeName === 'Elevator') return

        let baseKey = toCamelCase(typeName)
        if (baseKey === 'cableway') baseKey = 'cableWay'

        row[`${baseKey}All`] = typeItem.activeCount || 0
        row[`${baseKey}Valid`] = typeItem.validCount || 0
        row[`${baseKey}Inactive`] = typeItem.inactiveCount || 0
        row[`${baseKey}Expired`] = typeItem.expiredCount || 0
        row[`${baseKey}NoDate`] = typeItem.noDateCount || 0

        row.allEquipmentsTotalAll += typeItem.activeCount || 0
        row.allEquipmentsTotalValid += typeItem.validCount || 0
        row.allEquipmentsTotalInactive += typeItem.inactiveCount || 0
        row.allEquipmentsTotalExpired += typeItem.expiredCount || 0
        row.allEquipmentsTotalNoDate += typeItem.noDateCount || 0
      })

      // Ensure all equipment types have at least 0
      ALL_EQUIPMENTS.forEach((i) => {
        let baseKey = toCamelCase(String(i.equipmentType || ''))
        if (baseKey === 'cableway') baseKey = 'cableWay'

        if (row[`${baseKey}All`] === undefined) row[`${baseKey}All`] = 0
        if (row[`${baseKey}Valid`] === undefined) row[`${baseKey}Valid`] = 0
        if (row[`${baseKey}Inactive`] === undefined) row[`${baseKey}Inactive`] = 0
        if (row[`${baseKey}Expired`] === undefined) row[`${baseKey}Expired`] = 0
        if (row[`${baseKey}NoDate`] === undefined) row[`${baseKey}NoDate`] = 0
      })

      return row
    })

    const filteredData = flattenedData.filter((r) => !r.isSummary)
    let backendSummary = flattenedData.find((r) => r.isSummary)

    if (!backendSummary) {
      // Fallback just in case backend doesn't return it
      backendSummary = {
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
        backendSummary[`${baseKey}All`] = 0
        backendSummary[`${baseKey}Valid`] = 0
        backendSummary[`${baseKey}Inactive`] = 0
        backendSummary[`${baseKey}Expired`] = 0
        backendSummary[`${baseKey}NoDate`] = 0
      })
    } else {
      backendSummary.regionName = 'Respublika bo‘yicha'
    }

    const finalData = [backendSummary, ...filteredData]
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
