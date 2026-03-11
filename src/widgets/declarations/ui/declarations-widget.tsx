import { DeclarationsTable } from '@/features/declarations/ui/declarations-table'
import { Button } from '@/shared/components/ui/button'
import { AlertCircle, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { useCustomSearchParams, useData, usePaginatedData } from '@/shared/hooks'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { DeclarationTabKey, DeclarationTabs } from '@/features/declarations/ui/declaration-tabs'

const DeclarationsWidget = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAdd = () => {
    navigate('/declarations/add')
  }

  const canAdd = user?.role === UserRoles.LEGAL

  const { paramsObject, addParams } = useCustomSearchParams()
  const { status: tabStatus = 'ALL' } = paramsObject

  const { totalElements: allCount } = usePaginatedData<any>('/declarations', { page: 1, size: 1 })
  const { totalElements: inProcessCount } = usePaginatedData<any>('/declarations', {
    page: 1,
    size: 1,
    status: 'IN_PROCESS',
  })
  const { totalElements: completedCount } = usePaginatedData<any>('/declarations', {
    page: 1,
    size: 1,
    status: 'COMPLETED',
  })
  const { totalElements: rejectedCount } = usePaginatedData<any>('/declarations', {
    page: 1,
    size: 1,
    status: 'REJECTED',
  })
  const { totalElements: canceledCount } = usePaginatedData<any>('/declarations', {
    page: 1,
    size: 1,
    status: 'CANCELED',
  })

  const { data: status = 'NOT_PERMITTED' } = useData<any>('/accreditations/status', canAdd)

  const counts: Record<string, number> = {
    [DeclarationTabKey.ALL]: Number(allCount) || 0,
    [DeclarationTabKey.IN_PROCESS]: Number(inProcessCount) || 0,
    [DeclarationTabKey.COMPLETED]: Number(completedCount) || 0,
    [DeclarationTabKey.REJECTED]: Number(rejectedCount) || 0,
    [DeclarationTabKey.CANCELED]: Number(canceledCount) || 0,
  }

  const isStopped = status === 'STOPPED'
  const isExpired = status === 'EXPIRED'
  const isExpiringSoon = status === 'EXPIRING_SOON'

  const showAddButton = status === 'ACTIVE' || status === 'NOT_PERMITTED' || isExpiringSoon

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {canAdd && (
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
                Ekspert tashkilotining muddati tugaganligi sababli tizimda Deklaratsiyani ro‘yxatdan o‘tkazish
                imkoniyati vaqtincha cheklandi!
              </AlertDescription>
            </Alert>
          )}

          {isExpiringSoon && (
            <Alert className="m-0 flex h-10 w-full items-center border-yellow-200 bg-yellow-50 px-4 py-2 text-yellow-700">
              <AlertCircle className="mr-2 h-4 w-4 text-yellow-700" />
              <AlertDescription className="text-sm font-medium whitespace-nowrap text-yellow-700">
                Diqqat! Ekspert tashkilotining muddati yaqinlashmoqda. Iltimos, muddatini uzaytirish choralarini
                ko‘ring!
              </AlertDescription>
            </Alert>
          )}

          {showAddButton && (
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
            </Button>
          )}
        </div>
      )}

      <DeclarationTabs activeTab={tabStatus} onTabChange={(id) => addParams({ status: id })} counts={counts} />

      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
        <DeclarationsTable />
      </div>
    </div>
  )
}

export default DeclarationsWidget
