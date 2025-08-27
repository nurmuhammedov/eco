import React, { Fragment } from 'react';
import ApplicationCard from '@/entities/create-application/ui/application-card';
import { REPORTS_DATA } from '@/entities/create-application';

export const ReportsGrid: React.FC = () => {
  const SubApplication = React.memo(() => {
    const gridClasses = 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4';

    return (
      <div className={gridClasses}>
        {REPORTS_DATA.map((application) => (
          <ApplicationCard url="reports" key={application.id} application={application} btnTitle="Hisobotni ko‘rish" />
        ))}
      </div>
    );
  });

  SubApplication.displayName = 'SubApplication';

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-semibold">Hisobotlar</h5>
      </div>
      <SubApplication />
    </Fragment>
  );
};

ReportsGrid.displayName = 'ReportsGrid';

export default React.memo(ReportsGrid);
