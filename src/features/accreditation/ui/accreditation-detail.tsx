import { useCustomSearchParams, useDetail } from '@/shared/hooks';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import { getDate } from '@/shared/utils/date';
import FileLink from '@/shared/components/common/file-link';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data';
import { AccreditationSphere } from '@/entities/accreditation/models/accreditation.enums';
import { useApplicationDetail } from '@/features/application/application-detail/hooks/use-application-detail';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info';
import { Link } from 'react-router-dom';
import { GoBack } from '@/shared/components/common';

const AccreditationDetail = () => {
  const {
    paramsObject: { id = undefined },
  } = useCustomSearchParams();
  const { data } = useDetail<any>(`/accreditations/`, id);

  const { data: appeal } = useApplicationDetail();

  const formattedSpheres =
    data?.accreditationSpheres && data?.accreditationSpheres?.length > 0
      ? data.accreditationSpheres
          .map((sphereKey: AccreditationSphere) => {
            const sphere = ACCREDITATION_SPHERE_OPTIONS.find((opt) => opt.id == sphereKey);
            return sphere ? `${sphere.point}. ${sphere.name}` : sphereKey;
          })
          .join(',')
      : null;

  const isLegalApplication = !!appeal?.legalTin;

  return (
    <>
      <GoBack title={`${data?.legalName} - ${data?.tin}`} />

      <div className="grid grid-cols-1 gap-4 mt-4">
        <DetailCardAccordion
          defaultValue={['appeal', 'general', 'appeal_files', 'applicant_info_legal', 'applicant_info_individual']}
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
              <LegalApplicantInfo tinNumber={appeal?.legalTin} />
            </DetailCardAccordion.Item>
          )}

          <DetailCardAccordion.Item value="general" title="Akkreditatsiya to‘g‘risida maʼlumot">
            <div className="py-1  flex flex-col">
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
              <DetailRow title="Ekspert tashkiloti STIRi" value={data?.tin} />
              <DetailRow title="Ekspert tashkiloti nomi" value={data?.legalName} />
              <DetailRow title="Ekspert tashkiloti yuridik manzili" value={data?.legalAddress} />
              <DetailRow title="Ekspert tashkiloti telefon raqami" value={data?.phoneNumber} />
              <DetailRow title="Ekspert tashkiloti rahbari F.I.Sh." value={data?.fullName} />
              <DetailRow title="Attestat ro'yxat raqami" value={data?.certificateNumber} />
              <DetailRow title="Attestat berilgan sana" value={getDate(data?.certificateDate)} />
              <DetailRow title="Attestat amal qilish muddati" value={getDate(data?.certificateValidityDate)} />
              <DetailRow title="Akkreditatsiya sohalari" value={formattedSpheres} />

              {/*<div className="py-1  flex flex-col">*/}
              <DetailRow
                title="Akkreditatsiya komissiyasi qarori"
                value={<FileLink url={data?.accreditationCommissionDecisionPath} />}
              />
              <DetailRow title="Akkreditatsiya ilova fayli" value={<FileLink url={data?.referencePath} />} />
              <DetailRow
                title="Baholash komissiyasi qarori"
                value={<FileLink url={data?.assessmentCommissionDecisionPath} />}
              />
              <DetailRow
                title="Akkreditatsiya attestati"
                value={<FileLink url={data?.accreditationCertificatePath} />}
              />
              {/*</div>*/}
            </div>
          </DetailCardAccordion.Item>
          {/*<DetailCardAccordion.Item value="files" title="Arizaga biriktirilgan fayllar">*/}
          {/*  <div className="py-1  flex flex-col">*/}
          {/*    <DetailRow*/}
          {/*      title="Akkreditatsiya komissiyasi qarori"*/}
          {/*      value={<FileLink url={data?.accreditationCommissionDecisionPath} />}*/}
          {/*    />*/}
          {/*    <DetailRow*/}
          {/*      title="Baholash komissiyasi qarori"*/}
          {/*      value={<FileLink url={data?.assessmentCommissionDecisionPath} />}*/}
          {/*    />*/}
          {/*    <DetailRow title="Ma'lumotnoma" value={<FileLink url={data?.referencePath} />} />*/}
          {/*    <DetailRow title="Akkreditatsiya attestati" value={<FileLink url={data?.accreditationAttestationPath} />} />*/}
          {/*  </div>*/}
          {/*</DetailCardAccordion.Item>*/}

          {appeal?.files?.length > 0 && (
            <DetailCardAccordion.Item value="appeal_files" title="Arizaga biriktirilgan fayllar">
              <FilesSection
                files={appeal?.files || []}
                applicationStatus={appeal?.status}
                appealId={appeal?.id}
                edit={false}
              />
            </DetailCardAccordion.Item>
          )}
        </DetailCardAccordion>
      </div>
    </>
  );
};

export default AccreditationDetail;
