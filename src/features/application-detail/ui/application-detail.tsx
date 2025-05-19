// import React from 'react';

import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';

const ApplicationDetail = ({ data }: any) => {
  console.log(data);
  return (
    <div className="grid grid-cols-2 gap-4">
      <DetailCardAccordion>
        <DetailCardAccordion.Item value="general" title="Ariza va ijro to‘g‘risida maʼlumot">
          <DetailRow title="Ariza sanasi" value="01.01.2024 " />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
};

export { ApplicationDetail };
