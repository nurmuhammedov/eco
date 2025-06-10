import { GoBack } from '@/shared/components/common';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import { useHfDetail } from '@/features/register/hf/hooks/use-hf-detail.tsx';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import { Coordinate } from '@/shared/components/common/yandex-map';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx';
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx';
import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';
import { Link } from 'react-router-dom';

const HfDetail = () => {
  const { isLoading, data } = useHfDetail();
  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[]);

  if (isLoading || !data) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <GoBack title={`Reyestr raqami: ${data?.registryNumber || ''}`} />
      </div>
      <DetailCardAccordion defaultValue={['registry_info', 'applicant_info', 'object_info', 'object_location']}>
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
          <DetailRow
            title="XIChOni reyestrga kiritish uchun asos (ariza):"
            value={
              <Link className="text-[#0271FF]" to={'/applications/detail/' + data?.appealId}>
                Arizani ko‘rish
              </Link>
            }
          />
          <DetailRow title="XIChOni hisobga olish sanasi:" value={getDate(data?.registrationDate)} />
          <DetailRow title="XIChOni hisobga olish raqami:" value={data?.registryNumber} />
          <DetailRow title="XIChOni reyestrdan chiqarish sanasi:" value={getDate(data?.deregisterDate)} />
          <DetailRow title="XIChOni reyestrdan chiqarish sababi:" value={getDate(data?.deregisterReason)} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="applicant_info" title="Arizachi to‘g‘risida ma’lumot">
          <LegalApplicantInfo tinNumber={data?.legalTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={'HF'} address={data?.address} />
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

export default HfDetail;
