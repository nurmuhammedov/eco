import { ApplicationDetail } from '@/features/application-detail';
import { useApplicationDetail } from '@/features/application-detail/hooks/use-application-detail';
import { GoBack } from '@/shared/components/common';
import { useParams } from 'react-router-dom';

const ApplicationPage = () => {
  const { id = '' } = useParams();
  const { data } = useApplicationDetail(id, {});

  return (
    <div>
      <GoBack title={'Ариза рақами: 1-XIC-2025'} />
      <ApplicationDetail data={data} />
    </div>
  );
};
export default ApplicationPage;
