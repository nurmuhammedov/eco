import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { GoBack } from '@/shared/components/common'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { Badge } from '@/shared/components/ui/badge'
import { API_ENDPOINTS } from '@/shared/api/endpoints'
import { useRegionSelectQueries } from '@/shared/api/dictionaries'
import { format } from 'date-fns'

const DAYS_AGO_OPTIONS = [
  { value: '0', label: 'Kirganiga 5 kungacha bo‘lganlar' },
  { value: '5', label: 'Kirganiga 5 kundan 10 kungacha bo‘lganlar' },
  { value: '10', label: 'Kirganiga 10 kundan 15 kungacha bo‘lganlar' },
  { value: '15', label: 'Kirganiga 15 kundan 30 kungacha bo‘lganlar' },
  { value: '30', label: '30 kundan ortiq kirmaganlar' },
]

const EmployeeDeviceLoginReport: React.FC = () => {
  const { addParams, paramsObject } = useCustomSearchParams()
  const { data: regionsData } = useRegionSelectQueries()

  const { data, isLoading } = usePaginatedData<any>(API_ENDPOINTS.REPORTS_USER_LOGIN, {
    ...paramsObject,
    size: paramsObject.size || 20,
    page: paramsObject.page || 1,
  })

  const columns: any = useMemo(
    () => [
      {
        header: 'F.I.SH.',
        accessorKey: 'fullName',
        id: 'fullName',
        minSize: 200,
        className: 'font-medium',
        filterKey: 'fullName',
        filterType: 'search',
      },
      {
        header: 'Hudud',
        accessorKey: 'regionName',
        id: 'regionName',
      },
      {
        header: 'Oxirgi kirgan vaqti',
        accessorKey: 'lastLoginTime',
        id: 'lastLoginTime',
        className: 'whitespace-nowrap font-mono',
        cell: ({ getValue }: any) => {
          const val = getValue()
          return val ? format(new Date(val), 'dd.MM.yyyy HH:mm') : '-'
        },
      },
      {
        header: 'Qurilma turi',
        accessorKey: 'lastDeviceType',
        id: 'lastDeviceType',
        cell: ({ getValue }: any) => {
          const val = getValue()
          if (!val) return '-'
          const isPhone = val.toLowerCase().includes('phone') || val.toLowerCase().includes('android')
          const isTablet = val.toLowerCase().includes('ipad')
          return (
            <Badge variant={isPhone ? 'warning' : isTablet ? 'info' : 'outline'} className="whitespace-nowrap">
              {val}
            </Badge>
          )
        },
      },
      {
        header: 'Brauzer',
        accessorKey: 'lastBrowser',
        id: 'lastBrowser',
      },
      {
        header: 'Operatsion tizim',
        accessorKey: 'lastOs',
        id: 'lastOs',
        className: 'whitespace-nowrap',
      },
      {
        header: 'IP manzil',
        accessorKey: 'lastIpAddress',
        id: 'lastIpAddress',
        className: 'whitespace-nowrap font-mono text-slate-500',
      },
    ],
    []
  )

  return (
    <>
      <div className="mb-1.5 flex flex-col justify-between gap-4 p-0.5 sm:flex-row sm:items-center">
        <GoBack title="Xodimlar qurilmalardan kirish tarixi hisoboti" />

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={paramsObject.regionId?.toString() || 'all'}
            onValueChange={(val) => addParams({ regionId: val === 'all' ? undefined : val }, 'page')}
          >
            <SelectTrigger className="h-10 w-[180px] bg-white">
              <SelectValue placeholder="Hududni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha hududlar</SelectItem>
              {regionsData?.map((r: any) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={paramsObject.daysAgo?.toString() || 'all'}
            onValueChange={(val) => addParams({ daysAgo: val === 'all' ? undefined : val }, 'page')}
          >
            <SelectTrigger className="h-10 w-[250px] bg-white">
              <SelectValue placeholder="Kirgan vaqti bo‘yicha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha vaqtlar</SelectItem>
              {DAYS_AGO_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/*<DataTable*/}
      {/*  columns={columns}*/}
      {/*  data={data || []}*/}
      {/*  isLoading={isLoading}*/}
      {/*  pageCount={totalPages}*/}
      {/*  isPaginated={true}*/}
      {/*  showNumeration={true}*/}
      {/*  className="h-full"*/}
      {/*/>*/}

      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data || []}
        showFilters={true}
        isLoading={isLoading}
        className="flex-1"
      />
    </>
  )
}

export default EmployeeDeviceLoginReport
