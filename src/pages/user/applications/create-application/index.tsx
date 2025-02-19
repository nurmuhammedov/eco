import { lazy } from 'react';

const ApplicationForm = lazy(
  () => import('@/features/user/applications/create-application'),
);

const CreateApplicationPage = () => {
  return <ApplicationForm />;
};
export default CreateApplicationPage;
