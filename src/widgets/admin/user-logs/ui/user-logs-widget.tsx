import { UserLogsList } from '@/features/admin/user-logs/ui/user-logs-list';

import { Fragment, memo } from 'react';

const AttractionTypeWidget = () => {
  return (
    <Fragment>
      <div className="flex items-center justify-between mb-3 mt-4">
        <h5 className="text-xl font-semibold uppercase">User logs</h5>
      </div>
      <UserLogsList />
    </Fragment>
  );
};
export default memo(AttractionTypeWidget);
