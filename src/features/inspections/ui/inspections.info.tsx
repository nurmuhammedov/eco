import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { useSearchParams } from 'react-router-dom';
import ObjectsList from '@/features/inspections/ui/parts/objects-list.tsx';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts';
import InspectionsDetailInfo from '@/features/inspections/ui/parts/inpections-detail-info.tsx';
import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts';
import { InspectionStatus } from '@/widgets/inspection/ui/inspection-widget.tsx';
// import InspectionReports from '@/features/inspections/ui/parts/inspection-reports.tsx';

const InspectionsInfo = () => {
  const [searchParams] = useSearchParams();
  const currentTin = searchParams.get('tin');
  const { paramsObject } = useCustomSearchParams();
  const { user } = useAuth();
  const { data: inspectionData } = useInspectionDetail();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Tashkilot: ${paramsObject?.name || ''} (${currentTin})`} />
      </div>
      <DetailCardAccordion defaultValue={['risk_anlalysis_info', 'inspection_info', 'inspection_results']}>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="risk_anlalysis_info" title={`Xavfni tahlil qilish bo‘yicha ma’lumotlar`}>
          {user?.role === UserRoles.REGIONAL && inspectionData?.status === InspectionStatus.NEW && (
            <div className="flex justify-end py-2">
              <AttachInspectorModal />
            </div>
          )}
          <ObjectsList />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="inspection_info" title={`Tekshiruv ma’lumotlari`}>
          <InspectionsDetailInfo inspectionData={inspectionData} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="inspection_results" title={`Tekshiruv dasturi  (${paramsObject?.name || ''})`}>
          {/*<InspectionReports*/}
          {/*  status={inspectionData?.status}*/}
          {/*  checklistCategoryTypeId={inspectionData?.checklistCategoryTypeId}*/}
          {/*/>*/}
          <></>
        </DetailCardAccordion.Item>
        {/*<DetailCardAccordion.Item*/}
        {/*  value="type"*/}
        {/*  title={`Tekshiruvda aniqlangan kamchiliklar yuzasidan ko‘rilgan choralar  (${paramsObject?.name || ''})`}*/}
        {/*>*/}
        {/*  <div></div>*/}
        {/*</DetailCardAccordion.Item>*/}
      </DetailCardAccordion>
    </>
  );
};

export default InspectionsInfo;
