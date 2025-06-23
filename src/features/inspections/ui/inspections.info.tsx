import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { useSearchParams } from 'react-router-dom';
import ObjectsList from '@/features/inspections/ui/parts/objects-list.tsx';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';

const InspectionsInfo = () => {
  const [searchParams] = useSearchParams();
  const currentTin = searchParams.get('tin');
  const currentStatus = searchParams.get('status') || '';
  const { paramsObject } = useCustomSearchParams();
  const currentIntervalId = paramsObject?.intervalId;
  const { user } = useAuth();
  const isValidInterval = currentIntervalId == user?.interval?.id;
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Tashkilot STIR: ${currentTin}`} />
      </div>
      <DetailCardAccordion defaultValue={['risk_anlalysis_info']}>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          {isValidInterval && user?.role === UserRoles.REGIONAL && currentStatus.includes('NEW') && (
            <div className="flex justify-end py-2">
              <AttachInspectorModal />
            </div>
          )}
          <ObjectsList />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </>
  );
};

export default InspectionsInfo;
