import { ConclusionsTable, ConclusionTabs } from '@/features/expertise'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { TabKey } from '@/features/expertise/ui/conclusion-tabs'
import { Button } from '@/shared/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

const ExpertiseWidget = () => {
  const {
    paramsObject: { tab = TabKey.ALL },
    addParams,
  } = useCustomSearchParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const handleTabChange = (tabKey: string) => {
    addParams({ tab: tabKey }, 'page')
  }

  const { data } = useData<any>('/conclusions/count')
  const { data: status } = useData<any>('/accreditations/status', user?.role === UserRoles.LEGAL)

  const tabCounts = {
    [TabKey.ALL]: data?.allCount ?? 0,
    [TabKey.BI]: data?.bicount ?? 0,
    [TabKey.XD]: data?.xdcount ?? 0,
    [TabKey.TQ]: data?.tqcount ?? 0,
    [TabKey.LH]: data?.lhcount ?? 0,
    [TabKey.IX]: data?.ixcount ?? 0,
  }

  const handle = () => {
    navigate('/accreditations/add')
  }

  return (
    <>
      {status === 'ACTIVE' && (
        <div className="flex items-center justify-end">
          <Button onClick={handle}>
            <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <ConclusionTabs activeTab={tab} onTabChange={handleTabChange} counts={tabCounts} />
        <ConclusionsTable />
      </div>
    </>
  )
}

export default ExpertiseWidget
