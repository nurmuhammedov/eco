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

  const isStopped = status === 'STOPPED'
  const isExpired = status === 'EXPIRED'
  const isExpiringSoon = status === 'EXPIRING_SOON'

  const showAddButton = status === 'ACTIVE' || isExpiringSoon

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {user?.role === UserRoles.LEGAL && (
        <div className="flex items-center justify-end gap-4">
          {isStopped && (
            <Alert
              variant="destructive"
              className="m-0 flex h-10 w-full items-center border-red-200 bg-red-50 px-4 py-2 text-red-600"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription className="text-sm font-medium whitespace-nowrap">
                Ekspert tashkilotining faoliyati Qo‘mita tomonidan vaqtincha to‘xtatib qo‘yilgan!
              </AlertDescription>
            </Alert>
          )}

          {isExpired && (
            <Alert
              variant="destructive"
              className="m-0 flex h-10 w-full items-center border-red-200 bg-red-50 px-4 py-2 text-red-600"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              <AlertDescription className="text-sm font-medium whitespace-nowrap">
                Ekspert tashkilotining akkreditatsiya muddati tugaganligi sababli tizimda yangi xulosa yaratish
                imkoniyati vaqtincha cheklandi!
              </AlertDescription>
            </Alert>
          )}

          {isExpiringSoon && (
            <Alert className="m-0 flex h-10 w-full items-center border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-700">
              <AlertCircle className="mr-2 h-4 w-4 text-yellow-700" />
              <AlertDescription className="text-sm font-medium whitespace-nowrap text-yellow-700">
                Diqqat! Ekspert tashkilotining akkreditatsiya muddati yaqinlashmoqda. Iltimos, muddatini uzaytirish
                choralarini ko‘ring!
              </AlertDescription>
            </Alert>
          )}

          {showAddButton && (
            <Button onClick={handle}>
              <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <ConclusionTabs activeTab={tab} onTabChange={handleTabChange} counts={tabCounts} />
        <ConclusionsTable />
      </div>
    </div>
  )
}

export default ExpertiseWidget
