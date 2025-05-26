import { ApplicationDetail } from '@/features/application/application-detail';
import { GoBack } from '@/shared/components/common';
import { useDetail } from '@/shared/hooks';
import { useParams } from 'react-router-dom';

const ApplicationPage = () => {
  const { id = '' } = useParams();
  const { data } = useDetail<any>('/appeals/', id);

  console.log(data);
  return (
    <div>
      <GoBack title={`Ариза рақами: ${data?.number || ''}`} />
      <ApplicationDetail data={data} />
    </div>
  );
};
export default ApplicationPage;
