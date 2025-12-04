import { UserLogsList } from '@/features/admin/user-logs/ui/user-logs-list'

import { Fragment, memo } from 'react'

const AttractionTypeWidget = () => {
  return (
    <Fragment>
      <div className="mt-4 mb-3 flex items-center justify-between">
        <h5 className="text-xl font-semibold uppercase">Foydalanuvchilar harakatlari</h5>
      </div>
      <UserLogsList />
    </Fragment>
  )
}
export default memo(AttractionTypeWidget)
