import { useDetail } from '@/shared/hooks';
import { useParams } from 'react-router-dom';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import { getDate } from '@/shared/utils/date';
import FileLink from '@/shared/components/common/file-link';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data';
import { AccreditationSphere } from '@/entities/accreditation/models/accreditation.enums';

const AccreditationDetail = () => {
  const { id = undefined } = useParams();
  const { data } = useDetail<any>(`/accreditations/`, id);

  const formattedSpheres =
    data?.accreditationSpheres && data?.accreditationSpheres?.length > 0
      ? data.accreditationSpheres
          .map((sphereKey: AccreditationSphere) => {
            const sphere = ACCREDITATION_SPHERE_OPTIONS.find((opt) => opt.id == sphereKey);
            return sphere ? `${sphere.point}. ${sphere.name}` : sphereKey;
          })
          .join(',')
      : null;

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      <DetailCardAccordion defaultValue={['general']}>
        <DetailCardAccordion.Item value="general" title="Akkreditatsiya to‘g‘risida maʼlumot">
          <div className="py-1  flex flex-col">
            <DetailRow title="Tashkilot STIRi" value={data?.tin} />
            <DetailRow title="Yuridik nomi" value={data?.legalName} />
            <DetailRow title="Yuridik manzili" value={data?.legalAddress} />
            <DetailRow title="Telefon raqami" value={data?.phoneNumber} />
            <DetailRow title="Mas'ul shaxs F.I.Sh." value={data?.fullName} />
            <DetailRow title="Sertifikat raqami" value={data?.certificateNumber} />
            <DetailRow title="Sertifikat berilgan sana" value={getDate(data?.certificateDate)} />
            <DetailRow title="Sertifikat amal qilish muddati" value={getDate(data?.certificateValidityDate)} />
            <DetailRow title="Sohalar ro'yxati" value={formattedSpheres} />
            <DetailRow
              title="Akkreditatsiya komissiyasi qarori"
              value={<FileLink url={data?.accreditationCommissionDecisionPath} />}
            />
            <DetailRow
              title="Baholash komissiyasi qarori"
              value={<FileLink url={data?.assessmentCommissionDecisionPath} />}
            />
            <DetailRow title="Ma'lumotnoma" value={<FileLink url={data?.referencePath} />} />
            <DetailRow title="Akkreditatsiya attestati" value={<FileLink url={data?.accreditationAttestationPath} />} />
          </div>
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
};

export default AccreditationDetail;
