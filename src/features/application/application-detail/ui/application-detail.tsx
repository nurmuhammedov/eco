import { APPLICATIONS_DATA } from '@/entities/create-application';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import { getDate } from '@/shared/utils/date';

const ApplicationDetail = ({ data }: any) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      <DetailCardAccordion>
        <DetailCardAccordion.Item value="general" title="Ariza va ijro to‘g‘risida maʼlumot">
          <div className="py-1 px-2 flex flex-col">
            <DetailRow title="Ariza sanasi:" value={getDate(data?.createdAt)} />
            <DetailRow
              title="Ariza turi:"
              value={APPLICATIONS_DATA?.find((i) => i?.type == data?.appealType)?.title || ''}
            />
            <DetailRow title="Ariza holati:" value="-" />
            <DetailRow title="Ijro muddati:" value={getDate(data?.deadline)} />
            <DetailRow title="Ijrochi Qo‘mita masʼul bo‘limi:" value={data?.officeName || '-'} />
            <DetailRow title="Ijrochi Hududiy boshqarma nomi:" value={data?.regionName || '-'} />
            <DetailRow title="Hududiy boshqarma boshlig‘i F.I.Sh.:" value="-" />
            <DetailRow title="Hududiy boshqarma boshlig‘i rezolyutsiyasi:" value="-" />
            <DetailRow title="Ijrochi inspektor F.I.Sh.:" value={data?.executorName || '-'} />
            <DetailRow title="Ijrochi (inspektor) xulosasi:" value="-" />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
};

export { ApplicationDetail };
