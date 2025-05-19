import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';

const ApplicationDetail = ({ data }: any) => {
  console.log(data);
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <DetailCardAccordion>
        <DetailCardAccordion.Item value="general" title="Ariza va ijro to‘g‘risida maʼlumot">
          <div className="py-1 px-2 flex flex-col">
            <DetailRow title="Ariza sanasi" value="01.01.2024" />
            <DetailRow title="Ariza sanasi" value="01.01.2024" />
            <DetailRow title="Ariza sanasi" value="01.01.2024" />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
};

export { ApplicationDetail };
