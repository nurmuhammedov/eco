import { UserLogsList } from '@/features/admin/user-logs/ui/user-logs-list'

import { memo } from 'react'

const AttractionTypeWidget = () => {
  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <UserLogsList />
    </div>
  )
}
export default memo(AttractionTypeWidget)
