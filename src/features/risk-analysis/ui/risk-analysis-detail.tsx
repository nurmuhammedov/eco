import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useObjectInfo } from '@/features/risk-analysis/hooks/use-object-info.ts'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import FileLink from '@/shared/components/common/file-link.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { Link, useNavigate } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData, useData } from '@/shared/hooks'
import { format, formatDate } from 'date-fns'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { IrsList } from '@/features/register/irs/ui/irs-list'
import { XrayList } from '@/features/register/xray/ui/xray-list'
import { useTranslation } from 'react-i18next'

const RiskAnalysisDetail = () => {
  const { data: objectData } = useObjectInfo()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    paramsObject: { tin, id, type, name, ...rest },
  } = useCustomSearchParams()
  const currentTin = tin
  const objectId = id

  const { data: tableData, isLoading: isTableDataLoading } = usePaginatedData<any>(`/risk-analyses/belongings`, {
    ...rest,
    belongId: objectId,
    page: rest.page || 1,
    size: rest?.size || 10,
  })

  const currentBelongId = objectId

  const isRadProfile = type === 'IRS' || type === 'XRAY'
  const radType = type === 'IRS' ? 'IRS' : 'XRAY'

  const { data: radData } = useData<any>(`/radiation-profiles/${currentBelongId}`, isRadProfile)

  const data = isRadProfile ? radData : objectData

  const formattedFiles = radData?.files
    ? Object.entries(radData.files)
        .filter(([label]) => label.includes('Path'))
        .map(([key, val]) => ({
          label: t(`labels.${radType}.${key}`),
          data: val as any,
          fieldName: key,
        }))
    : []

  const handleView = (row: any) => {
    const orgName = data?.legalName || data?.ownerName || name || ''
    navigate(`/risk-analysis/info/${row.original.id}?tin=${tin}&name=${orgName}`)
  }

  const columns: ColumnDef<any>[] = [
    {
      header: 'Xavf tahlil davri',
      cell: ({ row }) =>
        `${formatDate(row.original.startDate, 'dd.MM.yyyy')} - ${formatDate(row.original.endDate, 'dd.MM.yyyy')}`,
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
      cell: ({ row }) => `${format(row.original.createdAt || new Date(), 'dd.MM.yyyy HH:mm:ss')}`,
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => <DataTableRowActions row={row} showView={true} onView={handleView} />,
    },
  ]

  if (!data) {
    return null
  }

  return (
    <>
      <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <GoBack
          title={`Tashkilot: ${data?.legalName || data?.ownerName || name || ''} ${currentTin ? `(${currentTin})` : ''}`}
        />
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
      <DetailCardAccordion
        defaultValue={['risk_anlalysis_info', 'registry_info', 'org_info', 'applicant_info', 'object_files', 'devices']}
      >
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          {currentBelongId ? (
            <>
              <DataTable data={tableData || []} columns={columns} isLoading={isTableDataLoading} />
            </>
          ) : (
            <div>Kerakli maʼlumotlar topilmadi...</div>
          )}
        </DetailCardAccordion.Item>
        {isRadProfile ? (
          <>
            <DetailCardAccordion.Item value="applicant_info" title="Tashkilot to‘g‘risida ma’lumot">
              <LegalApplicantInfo
                showUpdateButton={user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL}
                tinNumber={currentTin || radData?.legalTin}
              />
            </DetailCardAccordion.Item>

            <DetailCardAccordion.Item value="object_files" title="Tashkilotga biriktirilgan fayllar">
              <FilesSection files={formattedFiles} />
            </DetailCardAccordion.Item>

            <DetailCardAccordion.Item
              value="devices"
              title={radType === 'IRS' ? 'Ionlashtiruvchi nurlanish manbalari' : 'Rentgen qurilmalari'}
            >
              {radType === 'IRS' ? (
                <IrsList radiationProfileId={currentBelongId} isArchive={false} hideTabs={true} />
              ) : (
                <XrayList radiationProfileId={currentBelongId} isArchive={false} hideTabs={true} />
              )}
            </DetailCardAccordion.Item>
          </>
        ) : (
          <>
            <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
              {user?.role !== UserRoles.PROCURATOR && (
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
              )}
              <DetailRow title="Roʻyxatga olish sanasi:" value={getDate(data?.registrationDate)} />
              <DetailRow title="Roʻyxatga olish raqami:" value={data?.registryNumber} />
              {!!data?.registryFilePath && (
                <DetailRow
                  title="Reyestrga qo‘yilganligi to‘g‘risidagi hujjat:"
                  value={<FileLink url={data?.registryFilePath} />}
                />
              )}
            </DetailCardAccordion.Item>
            <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
              <LegalApplicantInfo tinNumber={currentTin} />
            </DetailCardAccordion.Item>
          </>
        )}
        {/*<DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">*/}
        {/*  <AppealMainInfo data={data} type={type?.toUpperCase()} address={data?.address} />*/}
        {/*</DetailCardAccordion.Item>*/}
        {/*<DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">*/}
        {/*  <FilesSection files={data?.files || []} />*/}
        {/*</DetailCardAccordion.Item>*/}
        {/*{!!currentObjLocation?.length && (*/}
        {/*  <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">*/}
        {/*    <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />*/}
        {/*  </DetailCardAccordion.Item>*/}
        {/*)}*/}
      </DetailCardAccordion>
    </>
  )
}

export default RiskAnalysisDetail
