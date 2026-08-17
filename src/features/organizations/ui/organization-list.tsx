import { useState, useMemo } from 'react'
import { Eye } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Switch } from '@/shared/components/ui/switch'
import { Button } from '@/shared/components/ui/button'
import { OrganizationInfoModal } from './organization-info-modal'
import { useCustomSearchParams } from '@/shared/hooks'
import { TabsLayout } from '@/shared/layouts'
import {
  Organization,
  FilterOrganizationDTO,
  LegalOwnershipType,
  useOrganizationsQuery,
  useOrganizationCounts,
  useUpdateOwnershipType,
} from '@/entities/organizations'

export function OrganizationList() {
  const { paramsObject, addParams, removeParams } = useCustomSearchParams()

  const {
    page = 1,
    size = 20,
    identity = '',
    name = '',
    address = '',
    regionId = '',
    legalForm = '',
    legalOwnership = '',
    legalOwnershipType = 'ALL',
  } = paramsObject

  const baseParams: FilterOrganizationDTO = {
    page: Number(page),
    size: Number(size),
    identity: identity || undefined,
    name: name || undefined,
    address: address || undefined,
    regionId: regionId ? Number(regionId) : undefined,
    legalForm: legalForm || undefined,
    legalOwnership: legalOwnership || undefined,
  }

  const queryParams: FilterOrganizationDTO = {
    ...baseParams,
    legalOwnershipType: legalOwnershipType !== 'ALL' ? (legalOwnershipType as LegalOwnershipType) : undefined,
  }

  const { data, isLoading } = useOrganizationsQuery(queryParams)
  const { data: counts } = useOrganizationCounts(baseParams)
  const updateOwnershipType = useUpdateOwnershipType()
  const [selectedTin, setSelectedTin] = useState<string | null>(null)

  const handleToggleOwnership = (id: string, currentOwnership: LegalOwnershipType | null) => {
    const newType = currentOwnership === 'STATE' ? 'NON_STATE' : 'STATE'
    updateOwnershipType.mutate({ id, ownershipType: newType })
  }

  const tabs = [
    { id: 'ALL', name: 'Barchasi', count: counts?.ALL || 0 },
    { id: 'STATE', name: 'Davlat tashkilotlari', count: counts?.STATE || 0 },
    { id: 'NON_STATE', name: "Davlat tashkilot bo'lmaganlar", count: counts?.NON_STATE || 0 },
  ]

  const columns: ExtendedColumnDef<Organization, any>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Nomi',
        maxSize: 300,
        filterKey: 'name',
        filterType: 'search',
      },
      {
        accessorKey: 'identity',
        header: 'STIR',
        maxSize: 150,
        cell: ({ row }) => row.original.identity || '-',
        filterKey: 'identity',
        filterType: 'search',
      },
      {
        accessorKey: 'address',
        header: 'Manzil',
        maxSize: 300,
        cell: ({ row }) => row.original.address || '-',
        filterKey: 'address',
        filterType: 'search',
      },
      {
        accessorKey: 'legalForm',
        header: 'Tashkiliy-huquqiy shakli',
        maxSize: 200,
        cell: ({ row }) => row.original.legalForm || '-',
        filterKey: 'legalForm',
        filterType: 'search',
      },
      {
        accessorKey: 'legalOwnership',
        header: 'Mulkchilik shakli',
        maxSize: 200,
        cell: ({ row }) => row.original.legalOwnership || '-',
        filterKey: 'legalOwnership',
        filterType: 'search',
      },
      {
        accessorKey: 'legalOwnershipType',
        header: 'Davlat tashkiloti',
        cell: ({ row }) => {
          const isState = row.original.legalOwnershipType === 'STATE'
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={isState}
                onChange={() => handleToggleOwnership(row.original.id, row.original.legalOwnershipType)}
              />
              <span className="text-sm">{isState ? 'Ha' : 'Yo‘q'}</span>
            </div>
          )
        },
        maxSize: 150,
      },
      {
        id: 'actions',
        header: 'Batafsil',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedTin(row.original.identity ? String(row.original.identity) : null)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
        maxSize: 80,
      },
    ],
    []
  )

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col gap-4 xl:flex-row-reverse xl:items-center xl:justify-between">
        <div className="min-w-0 overflow-x-auto xl:flex-1">
          <TabsLayout
            activeTab={legalOwnershipType as string}
            tabs={tabs}
            onTabChange={(value) => {
              if (value === 'ALL') {
                removeParams('legalOwnershipType')
              } else {
                addParams({ legalOwnershipType: value }, 'page')
              }
            }}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DataTable
          showFilters
          isPaginated
          data={data || []}
          isLoading={isLoading}
          columns={columns}
          className="flex-1"
        />
      </div>
      <OrganizationInfoModal tin={selectedTin} onClose={() => setSelectedTin(null)} />
    </div>
  )
}
