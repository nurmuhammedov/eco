import { DetailConclusion } from '@/features/expertise/ui/conclusion-detail';
import { GoBack } from '@/shared/components/common';

const ConclusionDetailPage = () => {
  return (
    <div>
      <GoBack title="Ekspertiza xulosasi tafsilotlari" />
      <DetailConclusion />
    </div>
  );
};

export default ConclusionDetailPage;
