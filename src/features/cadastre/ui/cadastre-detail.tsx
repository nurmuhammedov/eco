import { useCustomSearchParams, useDetail } from '@/shared/hooks';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import FileLink from '@/shared/components/common/file-link';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map';
import { Coordinate } from '@/shared/components/common/yandex-map';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info';
import { GoBack } from '@/shared/components/common';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section';
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail';

const CadastreDetail = () => {
  const {
    paramsObject: { id = undefined },
  } = useCustomSearchParams();

  const { data } = useDetail<any>(`/cadastre-passports/`, id);

  const { data: appeal } = useApplicationDetail();

  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[]);

  const isLegalApplication = !!data?.legalTin;

  return (
    <>
      <GoBack title={`${data?.legalName || ''} - ${data?.legalTin || ''}`} />

      <div className="grid grid-cols-1 gap-4 mt-4">
        <DetailCardAccordion
          defaultValue={[
            'applicant_info_legal',
            'general',
            'applicant_info_individual',
            'appeal_files',
            'object_location',
          ]}
        >
          {!isLegalApplication && (
            <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
              <div className="py-1  flex flex-col">
                <DetailRow title="Arizachi JSHIR:" value={'-'} />
                <DetailRow title="Arizachi F.I.SH:" value={'-'} />
                <DetailRow title="Arizachining manzili:" value={'-'} />
                <DetailRow title="Arizachining telefon raqami:" value={'-'} />
                <DetailRow title="Arizachining elektron pochtasi:" value={'-'} />
              </div>
            </DetailCardAccordion.Item>
          )}
          {isLegalApplication && (
            <DetailCardAccordion.Item value="applicant_info_legal" title="Arizachi to‘g‘risida ma’lumot">
              <LegalApplicantInfo tinNumber={data?.legalTin} />
            </DetailCardAccordion.Item>
          )}
          <DetailCardAccordion.Item value="general" title="Kadastr ma'lumotlari">
            <div className="py-1 flex flex-col">
              <DetailRow title="Tashkilot STIRi:" value={data?.organizationTin || '-'} />
              <DetailRow title="Tashkilot nomi:" value={data?.organizationName || '-'} />
              <DetailRow title="Tashkilot manzili:" value={data?.organizationAddress || '-'} />
              <DetailRow title="Reyestr raqami:" value={data?.registryNumber || '-'} />
              <DetailRow title="Obyekt nomi:" value={data?.hfName || '-'} />
              <DetailRow title="Obyekt joylashgan manzil:" value={data?.hfAddress || '-'} />
              <DetailRow title="Obyekt pasporti:" value={<FileLink url={data?.files?.passportPath} />} />
              <DetailRow title="Shartnoma:" value={<FileLink url={data?.files?.agreementPath} />} />
            </div>
          </DetailCardAccordion.Item>
          {appeal?.files?.length > 0 && (
            <DetailCardAccordion.Item value="appeal_files" title="Arizaga biriktirilgan fayllar">
              <FilesSection
                files={appeal?.files || []}
                applicationStatus={appeal?.status}
                appealId={appeal?.id}
                edit={true}
              />
            </DetailCardAccordion.Item>
          )}
          {!!currentObjLocation?.length && (
            <DetailCardAccordion.Item value="object_location" title="Obyekt joylashuvi">
              <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
            </DetailCardAccordion.Item>
          )}
        </DetailCardAccordion>
      </div>
    </>
  );
};

export default CadastreDetail;
