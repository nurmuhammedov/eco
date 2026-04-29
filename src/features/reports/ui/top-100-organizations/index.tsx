import React, { useMemo, useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'

const Top100OrganizationsReport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false)
  const { data: reportData, isLoading } = useData<any[]>('/reports/top-100-organizations', true)

  const tableData = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return []

    return reportData.map((item: any) => ({
      ...item,
      isSummary: item.legalName === 'Boshqa tashkilotlar' || !item.legalTin,
    }))
  }, [reportData])

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const res = await apiClient.downloadFile<Blob>('/reports/top-100-organizations/export-excel')
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `top-100-organizations.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Hisobot muvaffaqiyatli yuklab olindi')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Hisobotni yuklab olishda xatolik yuz berdi')
    } finally {
      setIsExporting(false)
    }
  }

  const columns = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      id: 'legalName',
      minSize: 300,
      cell: ({ row, getValue }: any) => (
        <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue()}</span>
      ),
    },
    {
      id: 'legalTin',
      header: 'STIR',
      accessorKey: 'legalTin',
      className: 'text-center',
      cell: ({ row, getValue }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || '-'}</span>
      ),
    },
    {
      id: 'managerCount',
      header: 'Rahbar xodimlar soni',
      accessorKey: 'managerCount',
      className: 'text-center',
      cell: ({ row, getValue }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>
      ),
    },
    {
      id: 'engineerCount',
      header: 'Muhandis-texnik xodimlar soni',
      accessorKey: 'engineerCount',
      className: 'text-center',
      cell: ({ row, getValue }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>
      ),
    },
    {
      id: 'workerCount',
      header: 'Oddiy ishchi xodimlar soni',
      accessorKey: 'workerCount',
      className: 'text-center',
      cell: ({ row, getValue }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>
      ),
    },
    {
      id: 'total',
      header: 'Jami',
      accessorKey: 'total',
      className: 'text-center',
      cell: ({ row, getValue }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Eng ko‘p 3 toifa xodimga ega Top-100 tashkilotlar" />
        <Button
          onClick={handleExport}
          disabled={isExporting || isLoading}
          variant="outline"
          className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
          Excelga yuklash
        </Button>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
          data={tableData}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={true}
          headerCenter={true}
          isHeaderSticky={true}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Top100OrganizationsReport
