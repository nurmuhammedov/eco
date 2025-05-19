import { ApplicationDetail } from '@/features/application-detail';
import { useNavigate } from 'react-router-dom';

const ApplicationPage = () => {
  const navigate = useNavigate();

  return <ApplicationDetail />;
};
export default ApplicationPage;
