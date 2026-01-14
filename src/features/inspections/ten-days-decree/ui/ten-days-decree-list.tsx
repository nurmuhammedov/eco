import { useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/shared/components/ui/button'
import { Eye, Signature } from 'lucide-react'
import { TenDaysSignModal } from './ten-days-sign-modal'
import { useCustomSearchParams } from '@/shared/hooks'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { useNavigate } from 'react-router-dom'
import { apiConfig } from '@/shared/api/constants'

interface TenDayDecree {
  id: string
  createdAt: string
  tin: number
  regionName: string
  districtName: string
  legalName: string
  legalAddress: string
  decreePath: string | null
}

export const TenDaysDecreeList = () => {
  const navigate = useNavigate()
  const { paramsObject } = useCustomSearchParams()
  const { page = 1, size = 10, year = new Date().getFullYear() } = paramsObject

  const { data, isLoading, totalPages } = usePaginatedData<TenDayDecree>('/inspections/decree/ten-days', {
    page: Number(page),
    size: Number(size),
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDecree, setSelectedDecree] = useState<{ inspectionId: string; filePath: string } | null>(null)

  const getFullUrl = (path: string | null) => {
    const relativePath = path
    if (relativePath?.startsWith('http')) return relativePath
    try {
      const url = new URL(apiConfig.baseURL)
      return `${url.origin}${relativePath}`
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return relativePath
    }
  }

  const handleOpenSignModal = (decree: TenDayDecree) => {
    const filePath = getFullUrl(decree.decreePath)
    setSelectedDecree({
      inspectionId: decree.id,
      filePath: filePath || '',
    })
    setModalOpen(true)
  }

  const columns: ColumnDef<TenDayDecree>[] = [
    {
      accessorKey: 'legalName',
      header: 'Tashkilot nomi',
    },
    {
      accessorKey: 'tin',
      header: 'STIR',
    },
    {
      accessorKey: 'regionName',
      header: 'Hudud',
      cell: ({ row }) => (
        <span>
          {row.original.regionName}, {row.original.districtName}
        </span>
      ),
    },
    {
      accessorKey: 'legalAddress',
      header: 'Manzil',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const decree = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate(
                  `/inspections/info?inspectionId=${decree.id}&tin=${decree.tin}&name=${decree.legalName}&year=${year}`
                )
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button size="sm" variant="default" className="h-8 px-2" onClick={() => handleOpenSignModal(decree)}>
              <Signature className="mr-2 h-4 w-4" />
              Imzolash
            </Button>
          </div>
        )
      },
      size: 120,
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        isPaginated
        pageCount={totalPages}
        className="flex-1"
      />

      <TenDaysSignModal open={modalOpen} onOpenChange={setModalOpen} data={selectedDecree} />
    </div>
  )
}
