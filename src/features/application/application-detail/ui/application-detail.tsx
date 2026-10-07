import { SourceTypeBadge } from '@/entities/application/ui/source-type-badge'
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
import { parseCoordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { getDate } from '@/shared/utils/date'
import { ApplicationStatusRow } from '@/entities/application/ui/application-status-row'
import { type ApplicationDetailWithFiles, ApplicationStatus } from '@/entities/application'
import { EmptyValue } from '@/shared/components/common/empty-value'

/** Reply documents only matter while the appeal is being agreed or approved */
const RESPONSE_DOCS_STATUSES = [ApplicationStatus.IN_AGREEMENT, ApplicationStatus.IN_APPROVAL]

function getDefaultDocsTab(status?: ApplicationStatus | null) {
  if (status === ApplicationStatus.IN_PROCESS) return 'applicant_docs'
  if (status && RESPONSE_DOCS_STATUSES.includes(status)) return 'response_docs'

  return 'info'
}

const ApplicationDetail = ({
  data,
  userRole,
}: {
  data?: ApplicationDetailWithFiles
  userRole?: UserRoles
  showAttestationActions?: boolean
}) => {
  const objectPoint = parseCoordinate(data?.data?.location)
  const isLegalApplication = data?.ownerType == 'LEGAL'
  // Registered by the committee's own staff: there is no applicant and no appeal to speak of
  const isRegistration = data?.mode === 'UNOFFICIAL'
  const ownerTitle = isRegistration ? 'Tashkilot to‘g‘risida ma’lumot' : 'Arizachi to‘g‘risida ma’lumot'
  const defaultDocsTab = getDefaultDocsTab(data?.status)

  const multiCategoryFiles = data?.multiCategoryFiles || {}
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
          <DetailCardAccordion.Item value="applicant_info_individual" title={ownerTitle}>
            <div className="flex flex-col py-1">
              <DetailRow
                title={isRegistration ? 'F.I.SH.:' : 'Arizachi F.I.SH.:'}
                value={data?.ownerName || <EmptyValue />}
              />
              <DetailRow
                title={isRegistration ? 'JSHSHIR:' : 'Arizachi JSHSHIR:'}
                value={data?.ownerIdentity || <EmptyValue />}
              />
              <DetailRow
                title={isRegistration ? 'Manzili:' : 'Arizachining manzili:'}
                value={data?.address || <EmptyValue />}
              />
              <DetailRow
                title={isRegistration ? 'Telefon raqami:' : 'Arizada bog‘lanish uchun ko‘rsatilgan telefon raqam:'}
                value={data?.phoneNumber || <EmptyValue />}
              />
            </div>
          </DetailCardAccordion.Item>
        )}

        {isLegalApplication && (
          <DetailCardAccordion.Item value="applicant_info_legal" title={ownerTitle}>
            <LegalApplicantInfo
              isShowPhoneNumber={true}
              tinNumber={data?.ownerIdentity}
              phoneNumber={data?.phoneNumber}
            />
          </DetailCardAccordion.Item>
        )}

        <DetailCardAccordion.Item
          value="general"
          title={isRegistration ? 'Ijro to‘g‘risida ma’lumot' : 'Ariza va ijro to‘g‘risida ma’lumot'}
        >
          <div className="flex flex-col py-1">
            {!isRegistration && (
              <DetailRow
                title="Ariza manbasi:"
                value={data?.sourceType ? <SourceTypeBadge sourceType={data.sourceType} /> : <EmptyValue />}
              />
            )}
            <DetailRow
              title={isRegistration ? 'Ro‘yxatga olish sanasi:' : 'Ariza sanasi:'}
              value={getDate(data?.createdAt)}
            />
            <DetailRow
              title={isRegistration ? 'Ro‘yxatga olish turi:' : 'Ariza turi:'}
              value={getApplicationTitle(data?.appealType)}
            />
            <ApplicationStatusRow status={data?.status} title={isRegistration ? 'Holati:' : undefined} />
            <DetailRow title="Ijro muddati:" value={getDate(data?.deadline)} />
            <DetailRow title="Ijrochi qo‘mita mas’ul bo‘limi:" value={data?.departmentName || <EmptyValue />} />
            <DetailRow title="Ijrochi hududiy boshqarma nomi:" value={data?.officeName || <EmptyValue />} />
            <DetailRow title="Hududiy boshqarma boshlig‘i F.I.SH.:" value={data?.approverName || <EmptyValue />} />
            <DetailRow title="Hududiy boshqarma boshlig‘i rezolyutsiyasi:" value={data?.resolution || <EmptyValue />} />
            <DetailRow title="Ijrochi mas’ul F.I.SH.:" value={data?.executorName || <EmptyValue />} />
            <DetailRow title="Ijrochi mas’ul xulosasi:" value={data?.conclusion || <EmptyValue />} />
          </div>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="appeal_docs"
          title={
            isRegistration ? 'Batafsil ma’lumotlar va hujjatlar' : 'Ariza bo‘yicha batafsil ma’lumotlar va hujjatlar'
          }
        >
          <Tabs
            key={defaultDocsTab}
            defaultValue={isRegistration && defaultDocsTab === 'applicant_docs' ? 'info' : defaultDocsTab}
          >
            <TabsList className="bg-neutral-250">
              <TabsTrigger value="info">Ma’lumotlar</TabsTrigger>
              {/* Nobody applied, so there are no applicant's documents to show */}
              {!isRegistration && <TabsTrigger value="applicant_docs">Arizachi hujjatlari</TabsTrigger>}
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
            applicationStatus={data?.status ?? undefined}
            appealId={data?.id}
          />
        ) : (
          !!data?.files.length && (
            <DetailCardAccordion.Item
              value="appeal_files"
              title={isRegistration ? 'Biriktirilgan fayllar' : 'Arizaga biriktirilgan fayllar'}
            >
              <FilesSection
                files={data?.files || []}
                userRole={userRole}
                applicationStatus={data?.status ?? undefined}
                appealId={data?.id}
                edit={true}
              />
            </DetailCardAccordion.Item>
          )
        )}

        {objectPoint && (
          <DetailCardAccordion.Item
            value="object_location"
            title={isRegistration ? 'Obyekt yoki qurilma joyi' : 'Arizada ko‘rsatilgan obyekt yoki qurilma joyi'}
          >
            <YandexMap coords={[objectPoint]} center={objectPoint} zoom={16} />
          </DetailCardAccordion.Item>
        )}
      </DetailCardAccordion>
    </div>
  )
}

export { ApplicationDetail }
