import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { useEquipmentsDetail } from '@/features/register/equipments/hooks/use-equipments-detail.tsx';
import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import FileLink from '@/shared/components/common/file-link.tsx';
import { Coordinate } from '@/shared/components/common/yandex-map';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx';
import { useDetail } from '@/shared/hooks';
import { getDate } from '@/shared/utils/date.ts';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/use-auth';

const EquipmentsDetail = () => {
  const { isLoading, data } = useEquipmentsDetail();
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[]);
  const { user } = useAuth();
  const { data: regNumber } = useDetail<any>(
    '/equipments/registry-number',
    data?.registryNumber,
    !!data?.registryNumber,
  );
  if (isLoading || !data) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
      </div>
      <DetailCardAccordion
        defaultValue={[
          'registry_info',
          'applicant_info',
          'applicant_info_individual',
          'object_info',
          'object_location',
          'object_files',
        ]}
      >
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
          <DetailRow
            title="Reyestrga kiritish uchun asos (ariza):"
            value={
              data?.appealId ? (
                <Link className="text-[#0271FF]" to={'/applications/detail/' + data?.appealId}>
                  Arizani ko‘rish
                </Link>
              ) : (
                <span className="text-red-600">Mavjud emas</span>
              )
            }
          />
          <DetailRow title="Hisobga olish sanasi:" value={getDate(data?.registrationDate)} />
          <DetailRow title="Hisobga olish raqami:" value={data?.registryNumber} />
          <DetailRow title="Qurilmaning eski hisobga olish raqami:" value={regNumber?.oldRegistryNumber || '-'} />
          {!!data?.registryFilePath && (
            <DetailRow title="Sertifikat fayli:" value={<FileLink url={data?.registryFilePath} />} />
          )}
          <DetailRow title="Reyestrdan chiqarish sanasi:" value={getDate(data?.deregisterDate)} />
          <DetailRow title="Reyestrdan chiqarish sababi:" value={getDate(data?.deregisterReason)} />
        </DetailCardAccordion.Item>
        {data?.ownerType != 'LEGAL' ? (
          <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
            <div className="py-1  flex flex-col">
              <DetailRow title="Arizachi JSHIR:" value={data?.ownerIdentity || '-'} />
              <DetailRow title="Arizachi F.I.SH:" value={data?.ownerName || '-'} />
              <DetailRow title="Arizachining manzili:" value={data?.address || '-'} />
              <DetailRow title="Arizachining telefon raqami:" value={data?.phoneNumber || '-'} />
            </div>
          </DetailCardAccordion.Item>
        ) : (
          <DetailCardAccordion.Item value="applicant_info" title="Arizachi to‘g‘risida ma’lumot">
            <LegalApplicantInfo tinNumber={data?.ownerIdentity} />
          </DetailCardAccordion.Item>
        )}
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={data?.type} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          {/*<FilesSection files={data?.files || []} />*/}
          <FilesSection
            appealId={data?.appealId}
            userRole={user?.role}
            register={true}
            url="equipments"
            files={data?.files || []}
          />
        </DetailCardAccordion.Item>
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
      </DetailCardAccordion>
    </div>
  );
};

export default EquipmentsDetail;
