import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import Filter from '@/shared/components/common/filter'
import { GoBack } from '@/shared/components/common'
import { apiClient } from '@/shared/api'
import { format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

export enum InspectionStatus {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

interface IAppealData {
  appealType: string
  total: number
  karakalpakstan: number
  andijan: number
  bukhara: number
  jizzakh: number
  kashkadarya: number
  navoi: number
  namangan: number
  samarkand: number
  syrdarya: number
  surkhandarya: number
  tashkent: number
  tashkentRegion: number
  fergana: number
  khorazm: number

  [key: string]: any
}

const Report1: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const activeTab = paramsObject.ownerType
  const { data, isLoading } = usePaginatedData<any>('/reports/appeal-type', {
    ...paramsObject,
    ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
  })

  const handleTabChange = (value: string) => {
    addParams({ ownerType: value })
  }

  function calcPercent(value: number, total: number): string {
    if (!total || total === 0) return '0.00%'
    return ((value / total) * 100).toFixed(2) + '%'
  }

  const inspections: any = data as unknown as any

  const totals = React.useMemo(() => {
    const initialTotals = {
      total: 0,
      karakalpakstan: 0,
      andijan: 0,
      bukhara: 0,
      jizzakh: 0,
      kashkadarya: 0,
      navoi: 0,
      namangan: 0,
      samarkand: 0,
      syrdarya: 0,
      surkhandarya: 0,
      tashkent: 0,
      tashkentRegion: 0,
      fergana: 0,
      khorezm: 0,
    }

    if (!inspections || inspections?.length === 0) {
      return initialTotals
    }

    return inspections?.reduce(
      (acc: any, currentItem: any) => {
        for (const key in initialTotals) {
          if (Object.prototype.hasOwnProperty.call(initialTotals, key)) {
            acc[key as keyof typeof initialTotals] += currentItem[key] || 0
          }
        }
        return acc
      },
      { ...initialTotals }
    )
  }, [inspections])

  const regionConfigs = [
    { header: "Qoraqalpog'iston XB", key: 'karakalpakstan' },
    { header: 'Andijon XB', key: 'andijan' },
    { header: 'Buxoro XB', key: 'bukhara' },
    { header: 'Jizzax XB', key: 'jizzakh' },
    { header: 'Qashqadaryo XB', key: 'kashkadarya' },
    { header: 'Navoiy XB', key: 'navoi' },
    { header: 'Namangan XB', key: 'namangan' },
    { header: 'Samarqand XBQ', key: 'samarkand' },
    { header: 'Sirdaryo XB', key: 'syrdarya' },
    { header: 'Surxondaryo XB', key: 'surkhandarya' },
    { header: 'Toshkent viloyati', key: 'tashkentRegion' },
    { header: 'Toshkent shahar (KSH)', key: 'tashkent' },
    { header: "Farg'ona XB", key: 'fergana' },
    { header: 'Xorazm XB', key: 'khorezm' },
  ]

  const columns: ColumnDef<IAppealData>[] = [
    {
      header: 'T/r',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Ariza turi',
      accessorKey: 'appealType',
      minSize: 350,
    },
    {
      header: 'Jami',
      columns: [
        {
          header: 'dona',
          accessorKey: 'total',
          size: 70,
        },
        {
          header: '%',
          size: 70,
          cell: ({ row }) => calcPercent(row.original.total, totals.total),
        },
      ],
    },
    ...regionConfigs.map((region) => ({
      header: region.header,
      columns: [
        {
          header: 'dona',
          accessorKey: region.key,
          size: 70,
        },
        {
          header: '%',
          size: 70,
          cell: ({ row }: any) => calcPercent(row.original[region.key], totals[region.key as keyof typeof totals]),
        },
      ],
    })),
  ]

  const handleDownloadExel = async () => {
    const res = await apiClient.downloadFile<Blob>('/reports/appeal-type/export-excel', {
      ...paramsObject,
      ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
    })

    const blob = res.data
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date()
    const filename = `Jismoniy va yuridik shaxslardan yuborilgan arizalarni turlari bo‘yicha hududlar kesimida taqsimlanishi (${format(today, 'dd.MM.yyyy')}).xlsx`
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
        <GoBack title="Jismoniy va yuridik shaxslardan yuborilgan arizalarni turlari bo‘yicha hududlar kesimida taqsimlanishi" />
      </div>

      <Tabs value={activeTab || InspectionStatus.INDIVIDUAL} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value={InspectionStatus.INDIVIDUAL}>Jismoniy shaxslar</TabsTrigger>
          <TabsTrigger value={InspectionStatus.LEGAL}>Yuridik shaxslar</TabsTrigger>
        </TabsList>

        <div className="my-2 flex items-start justify-between gap-2">
          <div className="flex flex-1 justify-start">
            <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
          </div>
          <Button onClick={handleDownloadExel}>
            <Download /> MS Exel
          </Button>
        </div>
        <TabsContent value={InspectionStatus.INDIVIDUAL}>
          <DataTable
            showNumeration={false}
            headerCenter={true}
            data={inspections || []}
            columns={columns as unknown as any}
            isLoading={isLoading}
            className="h-[calc(100vh-300px)]"
          />
        </TabsContent>
        <TabsContent value={InspectionStatus.LEGAL}>
          <DataTable
            showNumeration={false}
            headerCenter={true}
            data={inspections || []}
            columns={columns as unknown as any}
            isLoading={isLoading}
            className="h-[calc(100vh-320px)]"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Report1
