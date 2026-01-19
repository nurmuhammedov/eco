import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import FilesSection from '@/features/application/application-detail/ui/parts/files-section.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import { useObjectInfo } from '@/features/risk-analysis/hooks/use-object-info.ts'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import DetailRow from '@/shared/components/common/detail-row.tsx'
import FileLink from '@/shared/components/common/file-link.tsx'
import { Coordinate } from '@/shared/components/common/yandex-map'
import YandexMap from '@/shared/components/common/yandex-map/ui/yandex-map.tsx'
import { getDate } from '@/shared/utils/date.ts'
import { Link, useNavigate } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { format, formatDate } from 'date-fns'

const RiskAnalysisDetail = () => {
  const { data } = useObjectInfo()
  const navigate = useNavigate()
  const {
    paramsObject: { tin, id, type: ty, ...rest },
  } = useCustomSearchParams()
  const currentTin = tin
  const objectId = id
  let type = ty

  const { data: tableData, isLoading: isTableDataLoading } = usePaginatedData<any>(`/risk-analyses/belongings`, {
    ...rest,
    belongId: objectId,
    page: rest.page || 1,
    size: rest?.size || 10,
  })

  if (type !== 'hf' && type !== 'irs') {
    type = data?.type
  }

  const currentBelongId = objectId

  const currentObjLocation = data?.location?.split(',') || ([] as Coordinate[])

  const handleView = (row: any) => {
    navigate(`/risk-analysis/info/${row.original.id}?tin=${tin}&name=${data?.legalName || data?.ownerName || ''}`)
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
      <div className="mb-4 flex items-center justify-between gap-2">
        <GoBack
          title={`Tashkilot: ${data?.legalName || data?.ownerName || ''} ${currentTin ? `(${currentTin})` : ''}`}
        />
        {tableData?.content && tableData?.content?.length > 0 && (
          <div className="flex items-center justify-end gap-2">
            <div className="text-neutral-850 truncate text-base font-normal">
              Xavf tahlili natijasi: <span className="font-semibold">{tableData?.content?.[0]?.totalScore || 0}</span>
            </div>
            <div className="text-neutral-850 truncate text-base font-normal">
              Hozirgi holati: <span className="font-semibold">{tableData?.content?.[0]?.totalScore || 0}</span>
            </div>
          </div>
        )}
      </div>
      <DetailCardAccordion defaultValue={['risk_anlalysis_info']}>
        <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
          {currentBelongId ? (
            <>
              <DataTable data={tableData || []} columns={columns} isLoading={isTableDataLoading} />
            </>
          ) : (
            <div>Kerakli maʼlumotlar topilmadi...</div>
          )}
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="registry_info" title="Reyestr ma’lumotlari">
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
          <DetailRow title="Roʻyxatga olish sanasi:" value={getDate(data?.registrationDate)} />
          <DetailRow title="Roʻyxatga olish raqami:" value={data?.registryNumber} />
          {!!data?.registryFilePath && (
            <DetailRow title="Sertifikat fayli:" value={<FileLink url={data?.registryFilePath} />} />
          )}
          <DetailRow title="Reyestrdan chiqarish sanasi:" value={getDate(data?.deregisterDate)} />
          <DetailRow title="Reyestrdan chiqarish sababi:" value={getDate(data?.deregisterReason)} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida maʼlumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
          <AppealMainInfo data={data} type={type?.toUpperCase()} address={data?.address} />
        </DetailCardAccordion.Item>
        <DetailCardAccordion.Item value="object_files" title="Obyektga biriktirilgan fayllar">
          <FilesSection files={data?.files || []} />
        </DetailCardAccordion.Item>
        {!!currentObjLocation?.length && (
          <DetailCardAccordion.Item value="object_location" title="Obyekt yoki qurilma ko‘rsatilgan joyi">
            <YandexMap coords={[currentObjLocation]} center={currentObjLocation} zoom={16} />
          </DetailCardAccordion.Item>
        )}
      </DetailCardAccordion>
    </>
  )
}

export default RiskAnalysisDetail
