import { PermitTabs, PermitTable } from '@/features/permits'
import { PermitTabKey } from '@/entities/permit'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { AddPermitModal } from '@/features/permits/ui/add-permit-modal'
import { useState } from 'react'

export const PermitsWidget = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    paramsObject: { tab: activeTab = PermitTabKey.ALL },
    addParams,
  } = useCustomSearchParams()

  const handleTabChange = (tabKey: string) => {
    addParams({ tab: tabKey, page: '1' })
  }

  const { data } = useData<any>('/permits/count', true, {}, [], 10 * 24 * 60 * 60)

  const tabCounts = {
    [PermitTabKey.ALL]: data?.allCount ?? 0,
    [PermitTabKey.PERMIT]: data?.permissionCount ?? 0,
    [PermitTabKey.LICENSE]: data?.licenseCount ?? 0,
    [PermitTabKey.CONCLUSION]: data?.conclusionCount ?? 0,
    [PermitTabKey.NEARING_EXPIRY]: 0,
    [PermitTabKey.EXPIRED]: 0,
  }

  return (
    <>
      {/*<div className="flex justify-between gap-2 items-center">*/}
      {/*  <h1 className="text-2xl font-semibold">Ruxsatnomalar</h1>*/}
      {/*</div>*/}
      <div className="flex flex-col gap-5">
        <PermitTabs activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts} />
        <PermitTable setIsModalOpen={setIsModalOpen} />
        <AddPermitModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </>
  )
}
