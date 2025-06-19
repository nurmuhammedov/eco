import { usePreventionDetail } from '@/entities/prevention';
import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import FileLink from '@/shared/components/common/file-link';
import { useParams } from 'react-router-dom';

export default function PreventionViewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: prevention } = usePreventionDetail(id!);

  return (
    <div>
      <GoBack title="Profilaktika tadbiri" />
      <div className="mt-4">
        <DetailCardAccordion defaultValue={['main', 'files']}>
          <DetailCardAccordion.Item value="main" title="Asosiy ma'lumotlar">
            <DetailRow title="Tashkilot nomi" value={prevention?.data?.legalName} />
            <DetailRow title="Tashkilot STIR" value={prevention?.data?.tin} />
            <DetailRow title="Tashkilot manzili" value={prevention?.data?.legalAddress} />
            <DetailRow title="Hudud" value={prevention?.data?.regionName} />
            <DetailRow title="Tadbir sanasi" value={prevention?.data?.date} />
            <DetailRow title="Tadbir shakli" value={prevention?.data?.type?.name} />
            <DetailRow title="Tadbir mazmuni" value={prevention?.data?.content} />
            <DetailRow title="Tadbir fayli" value={<FileLink url={prevention?.data?.eventFilePath || ''} />} />
            <DetailRow
              title="Tashkilotga taaluqli fayl"
              value={<FileLink url={prevention?.data?.organizationFilePath || ''} />}
            />
          </DetailCardAccordion.Item>
        </DetailCardAccordion>
      </div>
    </div>
  );
}
