import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion } from '@/shared/components/common/detail-card'
import AttachInspectorModal from '@/features/inspections/ui/parts/attach-inspector-modal.tsx'
import NotifyInspectionModal from '@/features/inspections/ui/parts/notify-inspection-modal.tsx'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info.tsx'
import ObjectsList from '@/features/inspections/ui/parts/objects-list.tsx'
import { useAuth } from '@/shared/hooks/use-auth.ts'
import { UserRoles } from '@/entities/user'
import useCustomSearchParams from '../../../shared/hooks/api/useSearchParams.ts'
import InspectionsDetailInfo from '@/features/inspections/ui/parts/inpections-detail-info.tsx'
import { useInspectionDetail } from '@/features/inspections/hooks/use-inspection-detail.ts'
import { InspectionStatus } from '@/widgets/inspection/ui/inspection-widget.tsx'
import { useObjectList } from '@/features/inspections/hooks/use-object-list'
import { useData } from '@/shared/hooks'
import InspectionReports from '@/features/inspections/ui/parts/inspection-reports.tsx'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import AppealMainInfo from '@/features/application/application-detail/ui/parts/appeal-main-info.tsx'
import { Skeleton } from '@/shared/components/ui/skeleton'

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

  const { data: belongData, isLoading: isBelongLoading } = useQuery({
    queryKey: ['/belong-data', belongId, belongType],
    enabled: isOther && !!belongId && !!belongType,
    queryFn: async () => {
      const type = belongType?.toLowerCase()
      const { data } = await apiClient.get<any>(`/${type}/${belongId}`)
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

  const isPageLoading = isInspectionLoading || (isOther && isOtherDetailLoading)

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

      <DetailCardAccordion
        defaultValue={[
          'org_info',
          'belong_info',
          'risk_anlalysis_info',
          'inspection_info',
          ...(accordions?.length > 0 ? accordions.map((item: any) => `inspection_results-${item?.id}`) : []),
        ]}
      >
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
            {user?.role === UserRoles.REGIONAL && (
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
