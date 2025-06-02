import { APPLICATIONS_DATA } from '@/entities/create-application';
import { DetailCardAccordion } from '@/shared/components/common/detail-card';
import DetailRow from '@/shared/components/common/detail-row';
import { getDate } from '@/shared/utils/date';
import Stepper from '@/shared/components/common/stepper';
import { ApplicationStatus } from '@/entities/application';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx';
import AppealResponseDocs from '@/features/application/application-detail/ui/parts/appeal-response-docs.tsx';
import ApplicantDocsTable from '@/features/application/application-detail/ui/parts/applicant-docs-table.tsx';
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx';
import { Coordinate } from '@/shared/components/common/yandex-map';
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx';
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx';

const ApplicationDetail = ({ data }: any) => {
  const currentObjLocation = data?.data?.location.split(',') || ([] as Coordinate[]);
  const isLegalApplication = !!data?.legalTin;
  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      <DetailCardAccordion
        defaultValue={[
          'general',
          'applicant_info_individual',
          'applicant_info_legal',
          'appeal_docs',
          'appeal_files',
          'appeal_location',
        ]}
      >
        <DetailCardAccordion.Item value="general" title="Ariza va ijro to‘g‘risida maʼlumot">
          <div className="py-1 px-2 flex flex-col">
            <DetailRow title="Ariza sanasi:" value={getDate(data?.createdAt)} />
            <DetailRow
              title="Ariza turi:"
              value={APPLICATIONS_DATA?.find((i) => i?.type == data?.appealType)?.title || ''}
            />
            <DetailRow
              title="Ariza holati:"
              value={<Stepper activeStep={data?.status} steps={Object.values(ApplicationStatus).slice(1, -1)} />}
            />
            <DetailRow title="Ijro muddati:" value={getDate(data?.deadline)} />
            <DetailRow title="Ijrochi Qo‘mita masʼul bo‘limi:" value={data?.officeName || '-'} />
            <DetailRow title="Ijrochi Hududiy boshqarma nomi:" value={data?.regionName || '-'} />
            <DetailRow title="Hududiy boshqarma boshlig‘i F.I.Sh.:" value="-" />
            <DetailRow title="Hududiy boshqarma boshlig‘i rezolyutsiyasi:" value="-" />
            <DetailRow title="Ijrochi inspektor F.I.Sh.:" value={data?.executorName || '-'} />
            <DetailRow title="Ijrochi (inspektor) xulosasi:" value="-" />
          </div>
        </DetailCardAccordion.Item>
        {!isLegalApplication && (
          <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
            <div className="py-1 px-2 flex flex-col">
              <DetailRow title="Arizachi JSHIR:" value={'-'} />
              <DetailRow title="Arizachi F.I.SH:" value={'-'} />
              {/*<DetailRow title="Arizachining yashash viloyati:" value={'-'}/>*/}
              {/*<DetailRow title="Arizachining yashash tumani:" value={'-'}/>*/}
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
        <DetailCardAccordion.Item value="appeal_docs" title="Ariza bo‘yicha batafsil ma’lumotlar va hujjatlar">
          <Tabs defaultValue="info">
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="info">Ma’lumotlar</TabsTrigger>
              <TabsTrigger value="applicant_docs">Arizachi hujjatlari</TabsTrigger>
              <TabsTrigger value="response_docs">Javob hujjatlari</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <AppealMainInfo />
            </TabsContent>
            <TabsContent value="applicant_docs">
              <ApplicantDocsTable />
            </TabsContent>
            <TabsContent value="response_docs">
              <AppealResponseDocs />
            </TabsContent>
          </Tabs>
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="appeal_files" title="Arizaga biriktirilgan fayllar">
          <FilesSection files={data?.files || []} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="appeal_location" title="Arizada ko‘rsatilgan obyekt yoki qurilma joyi">
          <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
};

export { ApplicationDetail };
