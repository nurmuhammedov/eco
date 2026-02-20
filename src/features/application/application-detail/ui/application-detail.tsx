// src/features/application/application-detail/ui/application-detail.tsx
import { APPLICATIONS_DATA } from '@/entities/create-application'
import { UserRoles } from '@/entities/user'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import AppealResponseDocs from '@/features/application/application-detail/ui/parts/appeal-response-docs.tsx'
import ApplicantDocsTable from '@/features/application/application-detail/ui/parts/applicant-docs-table.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx'
import { getDate } from '@/shared/utils/date'
import { ApplicationStatusRow } from '@/shared/components/common/application-status-row'

const ApplicationDetail = ({
  data,
  userRole,
}: {
  data: any
  userRole?: UserRoles
  showAttestationActions?: boolean
}) => {
  const currentObjLocation = data?.data?.location?.split(',') || ([] as Coordinate[])
  const isLegalApplication = data?.ownerType == 'LEGAL'

  return (
    <div className="mt-2 grid grid-cols-1 gap-2">
      <DetailCardAccordion
        defaultValue={[
          'general',
          'applicant_info_individual',
          'applicant_info_legal',
          'appeal_docs',
          'employee_list',
          'appeal_files',
          'appeal_location',
        ]}
      >
        <DetailCardAccordion.Item value="general" title="Ariza va ijro to‘g‘risida maʼlumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Ariza sanasi:" value={getDate(data?.createdAt)} />
            <DetailRow
              title="Ariza turi:"
              value={APPLICATIONS_DATA?.find((i) => i?.type == data?.appealType)?.title || ''}
            />
            <ApplicationStatusRow status={data?.status} />
            <DetailRow title="Ijro muddati:" value={getDate(data?.deadline)} />
            <DetailRow title="Ijrochi Qo‘mita masʼul bo‘limi:" value={'-'} />
            <DetailRow title="Ijrochi Hududiy boshqarma nomi:" value={data?.officeName || '-'} />
            <DetailRow title="Hududiy boshqarma boshlig‘i F.I.SH.:" value={data?.approverName || '-'} />
            <DetailRow title="Hududiy boshqarma boshlig‘i rezolyutsiyasi:" value={data?.resolution || '-'} />
            <DetailRow title="Ijrochi ma‘sul F.I.SH.:" value={data?.executorName || '-'} />
            <DetailRow title="Ijrochi ma‘sul xulosasi:" value={data?.conclusion || '-'} />
          </div>
        </DetailCardAccordion.Item>

        {!isLegalApplication && (
          <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow title="Arizachi F.I.SH.:" value={data?.ownerName || '-'} />
              <DetailRow title="Arizachi JSHSHIR:" value={data?.ownerIdentity || '-'} />
              <DetailRow title="Arizachining manzili:" value={data?.address || '-'} />
              <DetailRow title="Arizachining telefon raqami:" value={data?.phoneNumber || '-'} />
            </div>
          </DetailCardAccordion.Item>
        )}

        {isLegalApplication && (
          <DetailCardAccordion.Item value="applicant_info_legal" title="Arizachi to‘g‘risida ma’lumot">
            <LegalApplicantInfo tinNumber={data?.ownerIdentity} />
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
              <AppealMainInfo
                data={data?.data}
                type={data?.appealType?.replace('DEREGISTER_', '')?.replace('REGISTER_', '')?.replace('RE_', '')}
                address={data?.address}
              />
            </TabsContent>
            <TabsContent value="applicant_docs">
              <ApplicantDocsTable />
            </TabsContent>
            <TabsContent value="response_docs">
              <AppealResponseDocs appeal_type={data?.appealType} />
            </TabsContent>
          </Tabs>
        </DetailCardAccordion.Item>

        {data?.files?.length > 0 && (
          <DetailCardAccordion.Item value="appeal_files" title="Arizaga biriktirilgan fayllar">
            <FilesSection
              files={data?.files || []}
              userRole={userRole}
              applicationStatus={data?.status}
              appealId={data?.id}
              edit={true}
            />
          </DetailCardAccordion.Item>
        )}

        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Arizada ko‘rsatilgan obyekt yoki qurilma joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
      </DetailCardAccordion>
    </div>
  )
}

export { ApplicationDetail }
