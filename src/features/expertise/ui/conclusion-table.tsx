import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useState } from 'react'
import ExpertiseFileUploadModal from '@/features/expertise/ui/parts/expertise-file-upload-modal'
import FileLink from '@/shared/components/common/file-link'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { UploadCloud } from 'lucide-react'

export const ConclusionsTable = () => {
  const {
    paramsObject: { page = 1, size = 10, tab = 'ALL', periodType = 'CURRENT', ...rest },
  } = useCustomSearchParams()
  const { user } = useAuth()
  const [id, setId] = useState<any>(null)
  const navigate = useNavigate()
  const { data = [], isLoading } = usePaginatedData<any>('/conclusions', {
    page: page,
    size: size,
    type: tab == 'ALL' ? null : tab,
    periodType: tab === 'XD' ? periodType : 'CURRENT',
    ...rest,
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'legalName',
      header: 'Ekspert tashkiloti nomi',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      accessorKey: 'legalTin',
      header: () => (
        <div className="whitespace-nowrap">
          Ekspert <br /> tashkilot STIR
        </div>
      ),
      className: '!w-[1%]',
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      accessorKey: 'customerName',
      header: 'Tashkilot nomi',
      filterKey: 'customerName',
      filterType: 'search',
    },
    {
      accessorKey: 'customerTin',
      header: () => <div className="whitespace-nowrap">Tashkilot STIR</div>,
      className: '!w-[1%]',
      filterKey: 'customerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'objectName',
      header: 'Reysterdagi obyektning nomi',
      filterKey: 'objectName',
      filterType: 'search',
    },
    {
      accessorKey: 'registryNumber',
      header: 'Reyestr raqami',
      className: '!w-[1%] whitespace-nowrap',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: () => (
        <div className="whitespace-nowrap">
          Rasmiylashtirish <br /> sanasi
        </div>
      ),
      className: '!w-[1%]',
      cell: (cell) => (cell.row.original.createdDate ? formatDate(cell.row.original.createdDate, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      className: '!w-[1%]',
      cell: ({ row }) =>
        row.original.processStatus == 'COMPLETED' ? (
          <Badge variant="success">Yakunlangan</Badge>
        ) : row.original.processStatus == 'NEW' ? (
          <Badge variant="info">Yangi</Badge>
        ) : null,
    },
    {
      accessorKey: 'registrationDate',
      id: 'registrationDate',
      header: () => (
        <div className="whitespace-nowrap">
          Reyestrga <br /> qo‘yilgan sana
        </div>
      ),
      className: '!w-[1%]',
      cell: (cell) =>
        cell.row.original.registrationDate ? formatDate(cell.row.original.registrationDate, 'dd.MM.yyyy') : null,
    },

    {
      header: 'Xulosa fayli',
      minSize: 200,
      cell: ({ row }: any) => (
        <div>
          {row.original?.processStatus == 'COMPLETED' && row.original.filePath ? (
            <FileLink url={row.original.filePath} />
          ) : user?.role == UserRoles.LEGAL ? (
            <Button
              onClick={() => {
                setId(row.original?.id)
              }}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Fayl yuklash
            </Button>
          ) : null}
        </div>
      ),
    },
    {
      id: 'actions',
      size: 50,
      cell: ({ row }: any) => {
        const isOld = tab === 'XD' && periodType === 'OLD'
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              showEdit={row.original?.processStatus != 'COMPLETED' && user?.role == UserRoles.LEGAL && !isOld}
              row={row}
              showView
              onEdit={(row: any) => !isOld && navigate(`edit/${row.original.id!}`)}
              onView={(row: any) =>
                isOld ? navigate(`old/detail/${row.original.id!}`) : navigate(`detail/${row.original.id!}`)
              }
            />
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data}
        showFilters={true}
        isLoading={isLoading}
        className="flex-1"
      />
      {user?.role == UserRoles.LEGAL && (
        <ExpertiseFileUploadModal
          id={id}
          closeModal={() => {
            setId(null)
          }}
        />
      )}
    </div>
  )
}
