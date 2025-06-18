import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import { GoBack } from '@/shared/components/common';
import RiskAnalysisInfo from '@/features/risk-analysis/ui/parts/risk-analysis-info.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { Link, useSearchParams } from 'react-router-dom';
import { useObjectInfo } from '@/features/risk-analysis/hooks/use-object-info.ts';
import { Coordinate } from '@/shared/components/common/yandex-map';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';
import FileLink from '@/shared/components/common/file-link.tsx';
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx';
import RiskAnalysisFilesToFix from '@/features/risk-analysis/ui/parts/risk-analysis-files-to-fix.tsx';
import { useFilesToFix } from '@/features/risk-analysis/hooks/use-files-to-fix.ts';

const RiskAnalysisDetail = () => {
  const { data } = useObjectInfo();
  const [searchParams] = useSearchParams();
  const currentTin = searchParams.get('tin');
  let type = searchParams.get('type') || '';
  const { data: filesToFix } = useFilesToFix();

  if (type !== 'hf' && type !== 'irs') {
    type = data?.type;
  }

  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[]);

  if (!data) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Tashkilot STIR: ${currentTin}`} />
      </div>
      <DetailCardAccordion
        defaultValue={[
          // 'org_info',
          // 'object_info',
          // 'files',
          // 'object_files',
          // 'object_location',
          // 'registry_info',
          'risk_anlalysis_info',
        ]}
      >
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
          <DetailRow
            title="Reyestrga kiritish uchun asos (ariza):"
            value={
              <Link className="text-[#0271FF]" to={'/applications/detail/' + data?.appealId}>
                Arizani ko‘rish
              </Link>
            }
          />
          <DetailRow title="Hisobga olish sanasi:" value={getDate(data?.registrationDate)} />
          <DetailRow title="Hisobga olish raqami:" value={data?.registryNumber} />
          {!!data?.registryFilePath && (
            <DetailRow title="Sertifikat fayli:" value={<FileLink url={data?.registryFilePath} />} />
          )}
          <DetailRow title="Reyestrdan chiqarish sanasi:" value={getDate(data?.deregisterDate)} />
          <DetailRow title="Reyestrdan chiqarish sababi:" value={getDate(data?.deregisterReason)} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={type?.toUpperCase()} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          <FilesSection files={data?.files || []} />
        </DetailCardAccordion.Item>
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
        {filesToFix && filesToFix?.length > 0 && (
          <DetailCardAccordion.Item value="files" title="Xavfni tahlil etish uchun arizachi yuborgan ma’lumotlar">
            <RiskAnalysisFilesToFix data={filesToFix} />
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          <RiskAnalysisInfo />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </>
  );
};

export default RiskAnalysisDetail;
