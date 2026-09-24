import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal'
import NotifyInspectionModal from '@/features/inspections/ui/parts/notify-inspection-modal'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import ObjectsList from '@/features/inspections/ui/parts/objects-list'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import useCustomSearchParams from '../../../shared/hooks/api/use-search-params'
import InspectionsDetailInfo from '@/features/inspections/ui/parts/inspection-detail-info'
import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail'
import { InspectionStatus } from '@/entities/inspection/models/inspection-status'
import { useObjectList } from '@/features/inspections/hooks/use-object-list'
import { useData } from '@/shared/hooks'
import InspectionReports from '@/features/inspections/ui/parts/inspection-reports'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useEffect, useState } from 'react'

const InspectionsInfo = () => {
  const {
    paramsObject: { tin: currentTin = '', name = '', inspectionId = '', inspectionType = '' },
  } = useCustomSearchParams()
  const { user } = useAuth()

  const isOther = inspectionType === 'other'

  const { data: inspectionData, isLoading: isInspectionLoading } = useInspectionDetail()

  const { data: otherDetail, isLoading: isOtherDetailLoading } = useData<any>(
    `/inspections/other/${inspectionId}`,
    isOther && !!inspectionId
  )

  const belongId = otherDetail?.belongId
  const belongType = otherDetail?.belongType

  // The object behind an inspection can be of any registered kind, so the
  // endpoint is only known at runtime - keyed by it all the same, or a change
  // to that register would never reach this page.
  const belongEndpoint = belongType ? `/${belongType.toLowerCase()}` : ''

  const { data: belongData, isLoading: isBelongLoading } = useQuery({
    queryKey: endpointKey(belongEndpoint, belongId),
    enabled: isOther && !!belongId && !!belongType,
    queryFn: async () => {
      const { data } = await apiClient.get<any>(`${belongEndpoint}/${belongId}`)
      return data.data
    },
  })

  const { data } = useObjectList(!isOther)
  const { data: accordions = [], isLoading: isAccordionsLoading } = useData<any[]>(
    '/inspection-results',
    !!inspectionId,
    {
      inspectionId,
    }
  )

  const typesList = [
    ...(data && data?.HF && Array.isArray(data?.HF) ? data.HF : []),
    ...(data && data?.ELEVATOR && Array.isArray(data?.ELEVATOR) ? data.ELEVATOR : []),
    ...(data && data?.ATTRACTION && Array.isArray(data?.ATTRACTION) ? data.ATTRACTION : []),
    ...(data && data?.IRS && Array.isArray(data?.IRS) ? data.IRS : []),
    ...(data && data?.XRAY && Array.isArray(data?.XRAY) ? data.XRAY : []),
    ...(data && data?.LPG_POWERED && Array.isArray(data?.LPG_POWERED) ? data.LPG_POWERED : []),
  ]

  const [openSections, setOpenSections] = useState<string[]>([
    'org_info',
    'belong_info',
    'risk_anlalysis_info',
    'inspection_info',
  ])

  useEffect(() => {
    if (!accordions?.length) return
    setOpenSections((current) => {
      const missing = accordions
        .map((item: any) => `inspection_results-${item?.id}`)
        .filter((section: string) => !current.includes(section))
      return missing.length > 0 ? [...current, ...missing] : current
    })
  }, [accordions])

  const isPageLoading = isInspectionLoading || (isOther && isOtherDetailLoading)

  const belongTypeFromResult = accordions?.[0]?.belongType
  const isHeadRoleTypes = belongTypeFromResult === 'XRAY' || belongTypeFromResult === 'IRS'
  const canManageInspection = isHeadRoleTypes ? user?.role === UserRoles.HEAD : user?.role === UserRoles.REGIONAL

  if (isPageLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-80" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <Skeleton className="h-[150px] w-full rounded-2xl" />
          <Skeleton className="h-[150px] w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="scrollbar-hidden flex min-h-[calc(100vh-100px)] flex-col gap-4 overflow-y-auto pb-0">
      <div className="flex items-center justify-between">
        <GoBack title={`Tashkilot: ${name} (${currentTin})`} />
      </div>

      <DetailCardAccordion value={openSections} onValueChange={setOpenSections}>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida ma’lumot">
          <LegalApplicantInfo tinNumber={currentTin} />
        </DetailCardAccordion.Item>

        {isOther ? (
          <DetailCardAccordion.Item value="belong_info" title="Obyekt yoki qurilma to‘g‘risida ma’lumot">
            {isBelongLoading ? (
              <div className="flex flex-col gap-4 p-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ) : (
              <AppealMainInfo data={belongData} type={belongType} address={belongData?.address} isRegister={true} />
            )}
          </DetailCardAccordion.Item>
        ) : (
          <DetailCardAccordion.Item value="risk_anlalysis_info" title="Xavfni tahlil qilish bo‘yicha ma’lumotlar">
            {canManageInspection && (
              <div className="flex justify-end py-2">
                {inspectionData?.status === InspectionStatus.NEW && (
                  <NotifyInspectionModal inspectionId={inspectionId} />
                )}
                {inspectionData?.status === InspectionStatus.NOTIFIED && (
                  <AttachInspectorModal data={typesList || []} />
                )}
              </div>
            )}
            <div className="min-h-[150px]">
              <ObjectsList />
            </div>
          </DetailCardAccordion.Item>
        )}

        <DetailCardAccordion.Item value="inspection_info" title="Tekshiruv ma’lumotlari">
          <InspectionsDetailInfo inspectionData={inspectionData} />
        </DetailCardAccordion.Item>

        {isAccordionsLoading ? (
          <div className="px-4 py-2">
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : (
          accordions?.length > 0 &&
          accordions?.map((item: any) => (
            <DetailCardAccordion.Item
              key={item.id}
              value={`inspection_results-${item?.id}`}
              title={`Tekshiruv dasturi (${item?.belongRegistryNumber} - ${item?.belongName})`}
            >
              <InspectionReports
                status={item?.status}
                specialCode={item?.specialCode}
                acknowledgementPath={item?.acknowledgementPath}
                additionalFilePath={item?.additionalFilePath}
                signedActPath={item?.signedActPath}
                explanationLetterPath={item?.explanationLetterPath}
                reportPath={item?.reportPath}
                familiarizationReportPath={item?.familiarizationReportPath}
                act={item?.act}
                resultId={item?.id}
              />
            </DetailCardAccordion.Item>
          ))
        )}
      </DetailCardAccordion>
    </div>
  )
}

export default InspectionsInfo
