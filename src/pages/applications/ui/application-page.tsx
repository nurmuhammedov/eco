import { Fragment } from 'react';
import { useApplicationPage } from '@/pages/applications';
import { ApplicationFilters } from '@/features/application-filters';

const ApplicationPage = () => {
  const { setFilters } = useApplicationPage();
  return (
    <Fragment>
      <ApplicationFilters onFilter={setFilters} />
    </Fragment>
  );
};
export default ApplicationPage;
