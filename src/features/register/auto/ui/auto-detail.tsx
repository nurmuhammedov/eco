import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import { useParams } from 'react-router-dom';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info';
import { useCustomSearchParams, useData } from '@/shared/hooks';

export default function PreventionViewPage() {
  const { id } = useParams<{ id: string }>();
  const {
    paramsObject: { tin: currentTin = '' },
  } = useCustomSearchParams();
  const { data } = useData<any>(`/auto/${id}`, false);

  return (
    <div>
      <div className="flex justify-between gap-2 items-center mb-3">
        <GoBack title="Transport vositasi" />
      </div>
      <div className="mt-4">
        <DetailCardAccordion defaultValue={['main', 'auto']}>
          <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
            <LegalApplicantInfo tinNumber={currentTin} />
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="main" title="Xulosa">
            <DetailRow title="Xulosa raqami" value={data?.conclusionNumber || '-'} />
            <DetailRow title="Xulosa berilgan sana" value={'-'} />
            <DetailRow title="Xulosa amal qilish muddati" value={'-'} />
            <DetailRow title="Faoliyat turi" value={'-'} />
          </DetailCardAccordion.Item>

          <DetailCardAccordion.Item value="auto" title="Avtotransport vositasi haqida">
            <DetailRow title="Davlat raqami belgisi" value={data?.conclusionNumber || '-'} />
            <DetailRow title="Avtotransport vositasi modeli" value={'-'} />
            <DetailRow title="Sig‘imning zavod raqami" value={'-'} />
            <DetailRow title="Sig‘imning ro‘yxat yoki inventarizatsiya raqami" value={'-'} />
            <DetailRow title="Sig‘imning hajmi" value={'-'} />
            <DetailRow title="Sig‘im hajmining o‘lchov birligi" value={'-'} />
            <DetailRow title="Texnik ko‘rik o‘tkazilgan sana" value={'-'} />
            <DetailRow title="Texnik ko‘rik amal qilish muddati" value={'-'} />
          </DetailCardAccordion.Item>
        </DetailCardAccordion>
      </div>
    </div>
  );
}
