import { ExpertiseTable } from '@/features/expertise/ui/expertise-table'
import { Button } from '@/shared/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { ExpertiseTabKey, ExpertiseTabs } from '@/features/expertise/ui/expertise-tabs'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'

const OrganizationsPage = () => {
  const {
    paramsObject: { status: activeTab = ExpertiseTabKey.ALL },
    addParams,
  } = useCustomSearchParams()

  const handleTabChange = (tabKey: string) => {
    addParams({ status: tabKey, page: '1' })
  }

  const { data: allData } = usePaginatedData<any>(
    '/accreditations',
    {
      page: 1,
      size: 1,
    },
    true,
    60000
  )

  const { data: activeData } = usePaginatedData<any>(
    '/accreditations',
    {
      page: 1,
      size: 1,
      status: ExpertiseTabKey.ACTIVE,
    },
    true,
    60000
  )

  const { data: expiringSoonData } = usePaginatedData<any>(
    '/accreditations',
    {
      page: 1,
      size: 1,
      status: ExpertiseTabKey.EXPIRING_SOON,
    },
    true,
    60000
  )

  const { data: expiredData } = usePaginatedData<any>(
    '/accreditations',
    {
      page: 1,
      size: 1,
      status: ExpertiseTabKey.EXPIRED,
    },
    true,
    60000
  )

  const tabCounts = {
    [ExpertiseTabKey.ALL]: allData?.page?.totalElements ?? 0,
    [ExpertiseTabKey.ACTIVE]: activeData?.page?.totalElements ?? 0,
    [ExpertiseTabKey.EXPIRED]: expiredData?.page?.totalElements ?? 0,
    [ExpertiseTabKey.EXPIRING_SOON]: expiringSoonData?.page?.totalElements ?? 0,
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-end">
        <Button disabled={true}>
          <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
        </Button>
      </div>
      <ExpertiseTabs activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts} />
      <ExpertiseTable />
    </>
  )
}

export default OrganizationsPage
