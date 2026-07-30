import { useState, useMemo } from 'react'
import { Eye } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Switch } from '@/shared/components/ui/switch'
import { Button } from '@/shared/components/ui/button'
import { OrganizationInfoModal } from './organization-info-modal'
import { useCustomSearchParams } from '@/shared/hooks'
import { useFilters } from '@/shared/hooks/use-filters'
import { TabsLayout } from '@/shared/layouts'
import useData from '@/shared/hooks/api/useData'
import { API_ENDPOINTS } from '@/shared/api'
import {
  Organization,
  FilterOrganizationDTO,
  useOrganizationsQuery,
  useOrganizationCounts,
  useUpdateOwnershipType,
} from '@/entities/organizations'

export function OrganizationList() {
  const { filters } = useFilters({}, { defaultSize: 20 })
  const {
    paramsObject: { ownershipType = 'ALL' },
    addParams,
    removeParams,
  } = useCustomSearchParams()

  const queryParams = { ...filters } as FilterOrganizationDTO
  if (ownershipType !== 'ALL') {
    queryParams.ownershipType = ownershipType as 'STATE' | 'NON_STATE'
  }

  const { data, isLoading } = useOrganizationsQuery(queryParams)
  const { data: counts } = useOrganizationCounts(filters as FilterOrganizationDTO)
  const updateOwnershipType = useUpdateOwnershipType()
  const [selectedTin, setSelectedTin] = useState<string | null>(null)

  const { data: regionOptions } = useData<any>(`${API_ENDPOINTS.REGIONS_SELECT}`)

  const handleToggleOwnership = (id: string, currentOwnership: string | undefined) => {
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
        cell: ({ row }) => row.original.tin || row.original.identity || '-',
        filterKey: 'identity',
        filterType: 'search',
      },
      {
        accessorKey: 'address',
        header: 'Hudud',
        maxSize: 300,
        cell: ({ row }) => row.original.region?.name || row.original.address || '-',
        filterKey: 'regionId',
        filterType: 'select',
        filterOptions: regionOptions || [],
      },
      {
        accessorKey: 'legalForm',
        header: 'Tashkiliy-huquqiy shakli',
        maxSize: 200,
        filterKey: 'legalForm',
        filterType: 'search',
      },
      {
        accessorKey: 'legalOwnership',
        header: 'Mulkchilik shakli',
        maxSize: 200,
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
              <span className="text-sm">{isState ? 'Ha' : "Yo'q"}</span>
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
            onClick={() => setSelectedTin(row.original.tin || row.original.identity || null)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
        maxSize: 80,
      },
    ],
    [regionOptions]
  )

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col gap-4 xl:flex-row-reverse xl:items-center xl:justify-between">
        <div className="min-w-0 overflow-x-auto xl:flex-1">
          <TabsLayout
            activeTab={ownershipType as string}
            tabs={tabs}
            onTabChange={(value) => {
              if (value === 'ALL') {
                removeParams('ownershipType')
              } else {
                addParams({ ownershipType: value }, 'page')
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
