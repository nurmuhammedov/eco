import { ConclusionsTable, ConclusionTabs } from '@/features/expertise'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { TabKey } from '@/features/expertise/ui/conclusion-tabs'
import { Button } from '@/shared/components/ui/button'
import { AlertCircle, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'

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

  const isDisabled = status === 'EXPIRED'

  return (
    <>
      {user?.role === UserRoles.LEGAL && (
        <div className="flex items-center justify-end gap-4">
          {isDisabled && (
            <Alert
              variant="destructive"
              className="m-0 flex h-10 w-auto items-center border-red-200 bg-red-50 px-4 py-2 text-red-600"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription className="text-sm font-medium whitespace-nowrap">
                Ekspert tashkilotining muddati o‘tgani sababidan tizimda amal bajarish cheklandi
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handle} disabled={isDisabled}>
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
