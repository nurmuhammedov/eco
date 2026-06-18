import React, { useMemo, useEffect, useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { GoBack } from '@/shared/components/common'
import { useRegionSelectQueries } from '@/shared/api/dictionaries'
import { apiClient } from '@/shared/api/api-client'
import {
  InquiryBelongType,
  inquiryBelongTypeLabels,
  InquiryStatus,
  inquiryStatusLabels,
  appealTypeTranslations,
} from '@/features/inquiries/model/types'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'

const InquiriesStatusReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const regionNameParam = paramsObject.regionName || 'ALL'
  const typeParam = paramsObject.type || 'ALL'

  const { data: regionsList, isLoading: isRegionsLoading } = useRegionSelectQueries()
  const regionOptions = useMemo(() => regionsList || [], [regionsList])

  const [tableData, setTableData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const visibleStatuses = useMemo(() => {
    let statuses = [
      InquiryStatus.NEW,
      InquiryStatus.IN_PROCESS,
      InquiryStatus.UNDER_INSPECTION,
      InquiryStatus.IN_COURT,
      InquiryStatus.REWARD_PAYMENT,
      InquiryStatus.REJECTED,
      InquiryStatus.COMPLETED,
    ]
    if (typeParam === 'SUGGESTION' || typeParam === 'APPEAL') {
      statuses = statuses.filter(
        (st) =>
          st !== InquiryStatus.UNDER_INSPECTION && st !== InquiryStatus.IN_COURT && st !== InquiryStatus.REWARD_PAYMENT
      )
    }
    return statuses
  }, [typeParam])

  useEffect(() => {
    if (!regionOptions.length) return

    let isMounted = true

    const fetchAllData = async () => {
      setIsLoading(true)

      // Filter out 'Respublika' from region items since we will add a summary row manually
      const filteredRegions = regionOptions.filter(
        (r: any) => r.name !== 'Respublika' && r.name !== 'Respublika bo‘yicha' && r.name !== "Respublika bo'yicha"
      )

      // The rows we want: 1 summary + all regions
      let rowsConfig = [
        { id: 'ALL', name: 'Respublika bo‘yicha', isSummary: true, regionId: null },
        ...filteredRegions.map((r: any) => ({
          id: r.id,
          name: r.name,
          isSummary: false,
          regionId: r.id,
        })),
      ]

      if (regionNameParam !== 'ALL') {
        rowsConfig = rowsConfig.filter((r) => r.name === regionNameParam)
      }

      const belongTypes = ['ALL_TYPES', ...Object.values(InquiryBelongType)]

      // Build all tasks
      const tasks: any[] = []

      rowsConfig.forEach((rowCfg) => {
        belongTypes.forEach((bt) => {
          const belongTypeParam = bt === 'ALL_TYPES' ? {} : { belongType: bt }
          const typePayload = typeParam !== 'ALL' ? { type: typeParam } : {}

          // Task for Jami (Total) for this belongType
          tasks.push({
            rowId: rowCfg.id,
            belongType: bt,
            status: null, // means total
            params: {
              page: 1,
              size: 1,
              ...belongTypeParam,
              ...typePayload,
              ...(rowCfg.regionId ? { regionId: rowCfg.regionId } : {}),
            },
          })

          // Tasks for each status
          visibleStatuses.forEach((st) => {
            tasks.push({
              rowId: rowCfg.id,
              belongType: bt,
              status: st,
              params: {
                page: 1,
                size: 1,
                ...belongTypeParam,
                ...typePayload,
                status: st,
                ...(rowCfg.regionId ? { regionId: rowCfg.regionId } : {}),
              },
            })
          })
        })
      })

      // We will fill this object with results
      // grouped[rowId][belongType_status] = count
      const grouped: Record<string, any> = {}
      rowsConfig.forEach((r) => {
        grouped[r.id] = { regionName: r.name, isSummary: r.isSummary }
        belongTypes.forEach((bt) => {
          grouped[r.id][`${bt}_TOTAL`] = 0
          visibleStatuses.forEach((st) => {
            grouped[r.id][`${bt}_${st}`] = 0
          })
        })
      })

      try {
        const promises = tasks.map(async (task) => {
          try {
            const res = await apiClient.getWithPagination<any>('/inquiries', task.params)
            const count = res.data?.page?.totalElements || 0

            if (task.status === null) {
              grouped[task.rowId][`${task.belongType}_TOTAL`] = count
            } else {
              grouped[task.rowId][`${task.belongType}_${task.status}`] = count
            }
          } catch (err) {
            console.error('Failed to fetch count for', task.params, err)
          }
        })

        await Promise.all(promises)

        if (isMounted) {
          // Construct final table data array
          const finalData = rowsConfig.map((r) => grouped[r.id])
          setTableData(finalData)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching inquiries stats:', error)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchAllData()

    return () => {
      isMounted = false
    }
  }, [regionOptions, regionNameParam, typeParam, visibleStatuses])

  const columns = useMemo(() => {
    const textColors: Record<string, string> = {
      [InquiryStatus.NEW]: 'text-blue-600',
      [InquiryStatus.IN_PROCESS]: 'text-amber-600',
      [InquiryStatus.UNDER_INSPECTION]: 'text-teal-600',
      [InquiryStatus.IN_COURT]: 'text-purple-600',
      [InquiryStatus.REWARD_PAYMENT]: 'text-indigo-600',
      [InquiryStatus.COMPLETED]: 'text-emerald-600',
      [InquiryStatus.REJECTED]: 'text-red-600',
    }

    return [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 200,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white font-medium',
        cell: ({ row }: any) => {
          const value = row.original.regionName
          return (
            <span className={cn(row.original.isSummary ? 'font-bold text-gray-800' : 'text-gray-700')}>{value}</span>
          )
        },
      },
      ...['ALL_TYPES', ...Object.values(InquiryBelongType)].map((bt) => {
        const headerTitle = bt === 'ALL_TYPES' ? 'Barchasi' : inquiryBelongTypeLabels[bt as InquiryBelongType]
        return {
          header: headerTitle,
          columns: [
            {
              header: 'Jami',
              accessorKey: `${bt}_TOTAL`,
              className: 'text-center bg-gray-50/50 border-x',
              cell: ({ row }: any) => {
                const val = row.original[`${bt}_TOTAL`]
                return (
                  <span
                    className={cn(row.original.isSummary ? 'font-bold text-gray-900' : 'font-semibold text-gray-700')}
                  >
                    {val}
                  </span>
                )
              },
            },
            ...visibleStatuses.map((st) => ({
              header: () => (
                <div className="text-center text-xs whitespace-nowrap">
                  {inquiryStatusLabels[st]?.split(' ').map((word: string, i: number) => (
                    <React.Fragment key={i}>
                      {word}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              ),
              accessorKey: `${bt}_${st}`,
              className: 'text-center min-w-[70px]',
              cell: ({ row }: any) => {
                const val = row.original[`${bt}_${st}`] || 0

                if (val === 0) {
                  return <span className={cn('text-gray-800', row.original.isSummary && 'font-bold')}>0</span>
                }

                return (
                  <span className={cn('font-semibold', textColors[st], row.original.isSummary ? 'font-bold' : '')}>
                    {val}
                  </span>
                )
              },
            })),
          ],
        }
      }),
    ]
  }, [visibleStatuses])

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-4 p-0.5 xl:flex-row xl:items-center">
        <GoBack title="Murojaatlar holati bo‘yicha hisobot" />

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

          <Select value={typeParam} onValueChange={(val) => addParams({ type: val })}>
            <SelectTrigger className="h-10 w-[220px] bg-white">
              <SelectValue placeholder="Murojaat turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              {Object.entries(appealTypeTranslations).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
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
          isLoading={isLoading || isRegionsLoading}
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

export default InquiriesStatusReport
