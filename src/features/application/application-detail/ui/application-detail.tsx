import { getApplicationTitle } from '@/entities/create-application'
import { UserRoles } from '@/shared/types/user'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import AppealResponseDocs from '@/features/application/application-detail/ui/parts/appeal-response-docs'
import ApplicantDocsTable from '@/features/application/application-detail/ui/parts/applicant-docs-table'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import { MultiCategoryFiles, multiCategoryFileValue } from './parts/multi-category-files'
import DetailRow from '@/shared/components/common/detail-row'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { getDate } from '@/shared/utils/date'
import { ApplicationStatusRow } from '@/entities/application/ui/application-status-row'
import { ApplicationStatus } from '@/entities/application'
import { EmptyValue } from '@/shared/components/common/empty-value'

/** Reply documents only matter while the appeal is being agreed or approved */
const RESPONSE_DOCS_STATUSES = [ApplicationStatus.IN_AGREEMENT, ApplicationStatus.IN_APPROVAL]

function getDefaultDocsTab(status?: ApplicationStatus) {
  if (status === ApplicationStatus.IN_PROCESS) return 'applicant_docs'
  if (status && RESPONSE_DOCS_STATUSES.includes(status)) return 'response_docs'

  return 'info'
}

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
  const defaultDocsTab = getDefaultDocsTab(data?.status)

  const multiCategoryFiles: Record<string, any[]> = data?.multiCategoryFiles || {}
  const multiCategoryIds = Object.keys(multiCategoryFiles)
  const hasMultiCategoryFiles = multiCategoryIds.length > 0

  return (
    <div className="mt-2 grid grid-cols-1 gap-2">
      <DetailCardAccordion
        defaultValue={[
          'general',
          'appeal_docs',
          'employee_list',
          'appeal_files',
          'appeal_location',
          ...multiCategoryIds.map(multiCategoryFileValue),
        ]}
      >
        {!isLegalApplication && (
          <DetailCardAccordion.Item value="applicant_info_individual" title="Arizachi to‘g‘risida ma’lumot">
            <div className="flex flex-col py-1">
              <DetailRow title="Arizachi F.I.SH.:" value={data?.ownerName || <EmptyValue />} />
              <DetailRow title="Arizachi JSHSHIR:" value={data?.ownerIdentity || <EmptyValue />} />
              <DetailRow title="Arizachining manzili:" value={data?.address || <EmptyValue />} />
              <DetailRow
                title="Arizada bog‘lanish uchun ko‘rsatilgan telefon raqam:"
                value={data?.phoneNumber || <EmptyValue />}
              />
            </div>
          </DetailCardAccordion.Item>
        )}

        {isLegalApplication && (
          <DetailCardAccordion.Item value="applicant_info_legal" title="Arizachi to‘g‘risida ma’lumot">
            <LegalApplicantInfo
              showTrainedEmployees
              isShowPhoneNumber={true}
              tinNumber={data?.ownerIdentity}
              phoneNumber={data?.phoneNumber}
            />
          </DetailCardAccordion.Item>
        )}

        <DetailCardAccordion.Item value="general" title="Ariza va ijro to‘g‘risida ma’lumot">
          <div className="flex flex-col py-1">
            <DetailRow title="Ariza sanasi:" value={getDate(data?.createdAt)} />
            <DetailRow title="Ariza turi:" value={getApplicationTitle(data?.appealType)} />
            <ApplicationStatusRow status={data?.status} />
            <DetailRow title="Ijro muddati:" value={getDate(data?.deadline)} />
            <DetailRow title="Ijrochi qo‘mita mas’ul bo‘limi:" value={data?.departmentName || <EmptyValue />} />
            <DetailRow title="Ijrochi hududiy boshqarma nomi:" value={data?.officeName || <EmptyValue />} />
            <DetailRow title="Hududiy boshqarma boshlig‘i F.I.SH.:" value={data?.approverName || <EmptyValue />} />
            <DetailRow title="Hududiy boshqarma boshlig‘i rezolyutsiyasi:" value={data?.resolution || <EmptyValue />} />
            <DetailRow title="Ijrochi mas’ul F.I.SH.:" value={data?.executorName || <EmptyValue />} />
            <DetailRow title="Ijrochi mas’ul xulosasi:" value={data?.conclusion || <EmptyValue />} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="appeal_docs" title="Ariza bo‘yicha batafsil ma’lumotlar va hujjatlar">
          <Tabs key={defaultDocsTab} defaultValue={defaultDocsTab}>
            <TabsList className="bg-neutral-250">
              <TabsTrigger value="info">Ma’lumotlar</TabsTrigger>
              <TabsTrigger value="applicant_docs">Arizachi hujjatlari</TabsTrigger>
              <TabsTrigger value="response_docs">Javob hujjatlari</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <AppealMainInfo
                trainedEmployeesTin={data?.ownerIdentity}
                data={data?.data}
                type={data?.appealType?.replace('DEREGISTER_', '')?.replace('REGISTER_', '')?.replace('RE_', '')}
                address={data?.address}
                number={data?.number}
                deadline={data?.deadline}
                resolution={data?.resolution}
                basisPath={data?.basisPath}
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

        {/* A multi-sector facility keeps one attachment set per category. */}
        {hasMultiCategoryFiles ? (
          <MultiCategoryFiles
            multiCategoryFiles={multiCategoryFiles}
            userRole={userRole}
            applicationStatus={data?.status}
            appealId={data?.id}
          />
        ) : (
          data?.files?.length > 0 && (
            <DetailCardAccordion.Item value="appeal_files" title="Arizaga biriktirilgan fayllar">
              <FilesSection
                files={data?.files || []}
                userRole={userRole}
                applicationStatus={data?.status}
                appealId={data?.id}
                edit={true}
              />
            </DetailCardAccordion.Item>
          )
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
