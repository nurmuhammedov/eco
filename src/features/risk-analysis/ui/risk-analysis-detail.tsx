import FilesSection from '@/features/application/application-detail/ui/parts/files-section'
import { RefreshLegalInfoButton } from '@/features/application/application-detail/ui/parts/refresh-legal-info-button'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import { useObjectInfo } from '@/features/risk-analysis/hooks/use-object-info'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row'
import FileLink from '@/shared/components/common/file-link'
import { getDate } from '@/shared/utils/date'
import { Link, useNavigate } from 'react-router-dom'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData, useData } from '@/shared/hooks'
import { format, formatDate } from 'date-fns'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { IrsList } from '@/features/register/irs/ui/irs-list'
import { XrayList } from '@/features/register/xray/ui/xray-list'
import { useTranslation } from 'react-i18next'
import { EmptyValue } from '@/shared/components/common/empty-value'
import { paramText } from '@/shared/lib/url-params'
import { toLabelledFiles } from '@/entities/application'
import type { RiskAnalysisPeriod } from '@/entities/risk-analysis/model/risk-analysis.types'
import type { RadiationProfile } from '@/shared/api/radiation-profile/use-radiation-profile-check'

const RiskAnalysisDetail = () => {
  const { data: objectData, isLoading: isObjectLoading } = useObjectInfo()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    paramsObject: { tin, id, type, name, ...rest },
  } = useCustomSearchParams()
  const currentTin = paramText(tin)
  const objectId = paramText(id)

  const { data: tableData, isLoading: isTableDataLoading } = usePaginatedData<RiskAnalysisPeriod>(
    `/risk-analyses/belongings`,
    {
      ...rest,
      belongId: objectId,
      page: rest.page || 1,
      size: rest?.size || 10,
    }
  )

  const isRadProfile = type === 'IRS' || type === 'XRAY'
  const radType = type === 'IRS' ? 'IRS' : 'XRAY'

  const { data: radData, isLoading: isRadLoading } = useData<RadiationProfile>(
    `/radiation-profiles/${objectId}`,
    isRadProfile && !!objectId
  )

  // A radiation profile does not carry the organisation's name, so it comes with the link
  const objectOwner = objectData && 'legalName' in objectData ? objectData.legalName : objectData?.ownerName
  const orgName = (!isRadProfile && objectOwner) || paramText(name)

  const formattedFiles = toLabelledFiles(radData?.files, (field) => t(`labels.${radType}.${field}`))

  const handleView = (row: Row<RiskAnalysisPeriod>) =>
    navigate(`/risk-analysis/objects/${row.original.id}?${new URLSearchParams({ tin: currentTin, name: orgName })}`)

  const columns: ColumnDef<RiskAnalysisPeriod>[] = [
    {
      header: 'Xavf tahlil davri',
      cell: ({ row }) =>
        [row.original.startDate, row.original.endDate]
          .map((day) => (day ? formatDate(day, 'dd.MM.yyyy') : '...'))
          .join(' - '),
    },
    {
      header: 'Inspektor',
      accessorKey: 'inspectorName',
    },
    {
      header: 'Jami bali',
      accessorKey: 'totalScore',
    },
    {
      header: 'Hudud',
      accessorKey: 'regionName',
    },
    {
      header: 'Ijobiylar soni',
      accessorKey: 'positiveCount',
    },
    {
      header: 'Salbiylar soni',
      accessorKey: 'negativeCount',
    },
    {
      header: 'Xavf tahlili o‘tkazilgan vaqt',
      cell: ({ row }) => (row.original.createdAt ? format(row.original.createdAt, 'dd.MM.yyyy HH:mm:ss') : '-'),
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => <DataTableRowActions row={row} showView={true} onView={handleView} />,
    },
  ]

  if (isObjectLoading || isRadLoading) return <DetailPageSkeleton sections={3} />
  if (!(isRadProfile ? radData : objectData)) return null

  return (
    <>
      <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <GoBack title={`Tashkilot: ${orgName} ${currentTin ? `(${currentTin})` : ''}`} />
        {tableData?.content && tableData?.content?.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
            <div className="text-neutral-850 truncate text-base font-normal">
              Xavf tahlili natijasi: <span className="font-semibold">{tableData?.content?.[0]?.totalScore || 0}</span>
            </div>
            <div className="text-neutral-850 truncate text-base font-normal">
              Hozirgi holati: <span className="font-semibold">{tableData?.content?.[0]?.totalScore || 0}</span>
            </div>
          </div>
        )}
      </div>
      <DetailCardAccordion defaultValue={['risk_analysis_info', 'registry_info', 'object_files', 'devices']}>
        <DetailCardAccordion.Item value="risk_analysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          {objectId ? (
            <>
              <DataTable data={tableData || []} columns={columns} isLoading={isTableDataLoading} />
            </>
          ) : (
            <div>Kerakli ma’lumotlar topilmadi...</div>
          )}
        </DetailCardAccordion.Item>
        {isRadProfile ? (
          <>
            <DetailCardAccordion.Item
              value="applicant_info"
              title="Tashkilot to‘g‘risida ma’lumot"
              action={
                user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL ? (
                  <RefreshLegalInfoButton tinNumber={currentTin || radData?.legalTin?.toString()} />
                ) : null
              }
            >
              <LegalApplicantInfo tinNumber={currentTin || radData?.legalTin?.toString()} />
            </DetailCardAccordion.Item>

            <DetailCardAccordion.Item value="object_files" title="Tashkilotga biriktirilgan fayllar">
              <FilesSection files={formattedFiles} />
            </DetailCardAccordion.Item>

            <DetailCardAccordion.Item
              value="devices"
              title={radType === 'IRS' ? 'Ionlashtiruvchi nurlanish manbalari' : 'Rentgen qurilmalari'}
            >
              {radType === 'IRS' ? (
                <IrsList radiationProfileId={objectId} isArchive={false} hideTabs={true} />
              ) : (
                <XrayList radiationProfileId={objectId} isArchive={false} hideTabs={true} />
              )}
            </DetailCardAccordion.Item>
          </>
        ) : (
          <>
            <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida ma’lumot">
              <LegalApplicantInfo tinNumber={currentTin} />
            </DetailCardAccordion.Item>
            <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
              {user?.role !== UserRoles.PROCURATOR && (
                <DetailRow
                  title="Reyestrga kiritish uchun asos (ariza):"
                  value={
                    objectData?.appealId ? (
                      <Link className="text-[#0271FF]" to={'/applications/' + objectData?.appealId}>
                        Arizani ko‘rish
                      </Link>
                    ) : (
                      <EmptyValue />
                    )
                  }
                />
              )}
              <DetailRow title="Ro‘yxatga olish sanasi:" value={getDate(objectData?.registrationDate)} />
              <DetailRow title="Ro‘yxatga olish raqami:" value={objectData?.registryNumber} />
              {!!objectData?.registryFilePath && (
                <DetailRow
                  title="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat:"
                  value={<FileLink url={objectData?.registryFilePath} />}
                />
              )}
            </DetailCardAccordion.Item>
          </>
        )}
      </DetailCardAccordion>
    </>
  )
}

export default RiskAnalysisDetail
