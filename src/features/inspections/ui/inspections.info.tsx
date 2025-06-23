import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { useSearchParams } from 'react-router-dom';

const InspectionsInfo = () => {
  const [searchParams] = useSearchParams();
  const currentTin = searchParams.get('tin');

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Tashkilot STIR: ${currentTin}`} />
      </div>
      <DetailCardAccordion defaultValue={['org_info', 'risk_anlalysis_info']}>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          <div className="flex justify-end py-2">
            <AttachInspectorModal />
          </div>
          risk_anlalysis_info
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </>
  );
};

export default InspectionsInfo;
